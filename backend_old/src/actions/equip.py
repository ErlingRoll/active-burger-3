from asyncio import create_task
from pydantic import BaseModel

from src.database.character import get_character_data_by_id, update_character
from src.actions.action import ActionRequest
from src.connection_manager import GameEvent
from src.gamestate import Gamestate
from src.database import upsert_equipment

from src.models import CharacterData, Item, EquipmentSlot


class UnequipItemPayload(BaseModel):
    slot: str


class EquipItemPayload(BaseModel):
    item: Item


async def unequip_item(action: ActionRequest):
    database = action.request.app["database"]
    gamestate: Gamestate = action.request.app["gamestate"]

    unequip_payload: UnequipItemPayload = UnequipItemPayload(**action.payload)

    character_data: CharacterData = await get_character_data_by_id(database, action.character.id)

    item = character_data.equipment.get(unequip_payload.slot)
    if not item:
        raise ValueError(f"No item equipped in slot {unequip_payload.slot}")

    character_data.unequip_item(item)

    create_task(update_character(database, character_data.to_character()))

    equipment = EquipmentSlot(character_id=action.character.id, item_id=None, slot=unequip_payload.slot)

    await upsert_equipment(database, equipment)

    await gamestate.publish_character(action.account.id, character_id=action.character.id)

    event = GameEvent(
        event="log",
        payload={},
        log=[f"You unequipped {unequip_payload.slot}"]
    )

    create_task(action.ws.send_json(event.model_dump()))


async def equip_item(action: ActionRequest):
    database = action.request.app["database"]
    gamestate: Gamestate = action.request.app["gamestate"]

    item = EquipItemPayload(**action.payload).item

    if not item or not item.equip_slot:
        raise ValueError(f"[equip_item] Invalid item or equip slot: {item}")

    character_data: CharacterData = await get_character_data_by_id(database, action.character.id)

    currently_equipped_item = character_data.equipment.get(item.equip_slot, None)
    if currently_equipped_item is not None and currently_equipped_item.id == item.id:
        return  # Item is already equipped

    if currently_equipped_item is not None:
        # Unequip the currently equipped item in that slot
        character_data.unequip_item(currently_equipped_item)

    equipment = EquipmentSlot(character_id=action.character.id, item_id=item.id, slot=item.equip_slot)
    await upsert_equipment(database, equipment)

    character_data.equip_item(item)

    create_task(update_character(database, character_data.to_character()))

    await update_character(database, character_data.to_character())
    await gamestate.publish_character(action.account.id, character_data=character_data)

    event = GameEvent(
        event="log",
        payload={},
        log=[f"You equipped {item.name}"]
    )

    create_task(action.ws.send_json(event.model_dump()))
