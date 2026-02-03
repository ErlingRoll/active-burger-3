from pydantic import BaseModel
from asyncio import create_task, gather

from src.actions.action import ActionRequest
from src.generators.item import generate_item
from src.connection_manager import GameEvent
from src.actions.item import add_or_stack_items, handle_item_consumption
from src.gamestate import Gamestate
from src.database import get_character_data_by_id, update_character
from src.models import CharacterData, Item


class BuyPayload(BaseModel):
    item_id: str
    price: int
    count: int = 1


class SellPayload(BaseModel):
    item_id: str
    count: int = 1


async def buy(action: ActionRequest):
    database = action.request.app['database']
    gamestate: Gamestate = action.request.app['gamestate']

    payload = BuyPayload(**action.payload)

    character_data: CharacterData = await get_character_data_by_id(database, action.character.id)

    item: Item = generate_item(payload.item_id)
    item.count = payload.count

    if not item.value:
        return await action.ws.send_json({
            'type': 'error',
            'message': f'Item {item.name} has no value.'
        })

    total_price = payload.price * payload.count

    if character_data.gold < total_price:
        event = GameEvent(
            event="log",
            payload={},
            log=[f"Not enough gold to buy {item.name} x{payload.count}. Ya poor!"]
        )
        return await action.ws.send_json(event.model_dump())

    character_data.gold -= total_price

    await add_or_stack_items(database, character_data, [item])
    await update_character(database, character_data.to_character())

    create_task(gamestate.publish_character(action.account.id, character_id=action.character.id))

    event = GameEvent(
        event="log",
        payload={},
        log=[f"You bought {item.name} x{payload.count} for {total_price} gold"]
    )
    create_task(action.ws.send_json(event.model_dump()))


async def sell(action: ActionRequest):
    database = action.request.app['database']
    gamestate: Gamestate = action.request.app['gamestate']
    tasks = []

    payload: SellPayload = SellPayload(**action.payload)

    character_data: CharacterData = await get_character_data_by_id(database, action.character.id)

    owned_item: Item = character_data.items.get(payload.item_id)
    if not owned_item:
        error_message = f"You do not own any {payload.item_id} to sell"
        event = GameEvent(
            event="log",
            payload={"error": error_message},
            log=[error_message]
        )
        return await action.ws.send_json(event.model_dump())

    if owned_item.count is not None and owned_item.count < payload.count:
        error_message = f"Not enough {owned_item.name} to sell"
        event = GameEvent(
            event="log",
            payload={"error": error_message},
            log=[error_message]
        )
        return await action.ws.send_json(event.model_dump())

    current_item = character_data.equipment.get(owned_item.equip_slot if owned_item.equip_slot else "", None)
    if current_item is not None and current_item.id == owned_item.id:
        event = GameEvent(
            event="log",
            payload={"error": f"You must unequip the {owned_item.equip_slot} before selling."},
        )
        return await action.ws.send_json(event.model_dump())

    total_sell_price = owned_item.value * payload.count

    character_data.gold += total_sell_price

    task = handle_item_consumption(database, owned_item, count=payload.count, consume=True)
    tasks.append(task)

    task = update_character(database, character_data.to_character())
    tasks.append(task)

    await gather(*tasks)

    create_task(gamestate.publish_character(action.account.id, character_id=action.character.id))

    event = GameEvent(
        event="log",
        payload={},
        log=[f"You sold {owned_item.name} x{payload.count} for {total_sell_price} gold"]
    )
    create_task(action.ws.send_json(event.model_dump()))
