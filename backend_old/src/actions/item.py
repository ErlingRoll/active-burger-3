from asyncio import create_task
from pydantic import BaseModel

from src.actions.action import ActionRequest
from src.connection_manager import GameEvent
from src.actions.equip import equip_item
from src.gamestate import Gamestate
from src.database.item import create_item, delete_item, get_item_by_id, update_item

from src.models import CharacterData, Item, UseResult


class UseItemPayload(BaseModel):
    id: str


async def add_or_stack_items(database, character_data: CharacterData, items: list[Item]):
    stackable_item_map: dict[str, Item] = {item.item_id: item for item in character_data.items.values() if item.stackable}

    for item in items:
        if item.stackable and item.item_id in stackable_item_map:
            existing_item = stackable_item_map[item.item_id]
            existing_item.count += item.count  # type: ignore
            await update_item(database, existing_item)
            continue

        item.character_id = character_data.id
        await create_item(database, item)


async def handle_item_consumption(database, item, count=1, consume=False):
    if not item.consumable and not consume:
        return

    if item.count == count:
        return await delete_item(database, item.id)

    if item.count and item.count > count:
        item.count -= count
        return await update_item(database, item)


async def use_item(action: ActionRequest):
    database = action.app["database"]
    gamestate: Gamestate = action.app["gamestate"]

    item_payload: UseItemPayload = UseItemPayload(**action.payload)

    item: Item = await get_item_by_id(database, item_payload.id)

    if not item:
        event = GameEvent(event="log", payload={}, log=["Item not found"])
        return await action.ws.send_json(event.model_dump())

    equip_action_request = ActionRequest(**action.model_dump())
    equip_action_request.payload = {"item": item}

    if item.equipable:
        return create_task(equip_item(equip_action_request))

    character_state = gamestate.get_character_state(action.character.id)

    result: UseResult = await item.use(database=database, gamestate=gamestate, character=character_state, ws=action.ws)

    event = GameEvent(event="log", payload={}, log=result.log)

    if not result.success:
        return await action.ws.send_str(event.model_dump_json())

    await handle_item_consumption(database, item)

    await gamestate.publish_character(action.account.id, character_id=action.character.id)

    return create_task(action.ws.send_str(event.model_dump_json()))
