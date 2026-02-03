from asyncio import create_task, gather
from pydantic import BaseModel

from src.database.character import get_character_data_by_id
from src.models.character import CharacterData
from src.models.equipment import EquipSlot
from src.database.equipment import get_equipment_item
from src.gamestate import Gamestate
from src.generators.item import generate_item
from src.actions.action import ActionRequest
from src.connection_manager import GameEvent
from src.database.item import delete_item, get_item_by_id, update_item

from src.models import Currency, Equipment


class ApplyCurrencyPayload(BaseModel):
    currency_id: str | None
    equipment_id: str | None


async def handle_item_consumption(database, item, count=1, consume=False):
    if not item.consumable and not consume:
        return

    if item.count == count:
        return await delete_item(database, item.id)

    if item.count and item.count > count:
        item.count -= count
        return await update_item(database, item)


async def apply_currency(action: ActionRequest):
    database = action.request.app['database']
    gamestate: Gamestate = action.request.app['gamestate']

    payload = ApplyCurrencyPayload(**action.payload)

    if payload.currency_id is None or payload.equipment_id is None:
        event = GameEvent(
            event="log",
            payload={"error": "Invalid payload for applying currency"},
        )
        return await action.ws.send_json(event.model_dump())

    currency_req = get_item_by_id(database, payload.currency_id)
    equipment_req = get_item_by_id(database, payload.equipment_id)
    character_data_req: CharacterData = get_character_data_by_id(database, action.character.id)

    currency_res, equipment_res, character_data_res = await gather(currency_req, equipment_req, character_data_req)

    if currency_res is None or equipment_res is None:
        event = GameEvent(
            event="log",
            log=["Failed to apply currency: Item or currency not found"],
        )
        return await action.ws.send_json(event.model_dump())

    currency: Currency = generate_item(**currency_res.model_dump())
    equipment: Equipment = generate_item(**equipment_res.model_dump())

    current_item = character_data_res.equipment.get(equipment.equip_slot if equipment.equip_slot else "", None)
    if current_item is not None and current_item.id == equipment.id:
        event = GameEvent(
            event="log",
            payload={"error": f"You must unequip the {equipment.equip_slot} before applying currency."},
        )
        return await action.ws.send_json(event.model_dump())

    apply_check = currency.apply_check(equipment)

    if not apply_check.success:
        event = GameEvent(
            event="log",
            payload={"error": f"Failed to apply {currency.name}: {apply_check.message}"},
        )
        return create_task(action.ws.send_json(event.model_dump()))

    modified_equipment = currency.apply_to(equipment)

    await update_item(database, modified_equipment)

    await handle_item_consumption(database, currency, count=1, consume=True)

    create_task(gamestate.publish_character(action.account.id, character_id=modified_equipment.character_id))
