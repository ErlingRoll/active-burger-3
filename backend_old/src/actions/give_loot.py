from typing import List
from aiohttp.web import Request, WebSocketResponse
from pydantic import BaseModel
from asyncio import create_task, gather

from src.connection_manager import GameEvent
from src.actions.item import add_or_stack_items
from src.models.character import CharacterData
from src.gamestate import Gamestate
from src.database.item import create_item, update_item
from src.database.character import get_character_by_id, get_character_data_by_id
from src.models import Account, Character, Item


class GiveLootPayload(BaseModel):
    items: List[Item]
    log: List[str]


async def give_loot(request: Request, ws: WebSocketResponse, account: Account, character: Character, payload: dict):
    database = request.app['database']
    gamestate: Gamestate = request.app['gamestate']

    payload: GiveLootPayload = GiveLootPayload(**payload)
    items = payload.items

    character_data: CharacterData = await get_character_data_by_id(database, character.id)

    await add_or_stack_items(database, character_data, items)
    create_task(gamestate.publish_items(account.id, character_id=character.id))

    if len(payload.items) == 0:
        return

    event = GameEvent(
        event="loot_drop",
        payload={
            "items": [item.model_dump() for item in payload.items],
        },
    )

    create_task(ws.send_json(event.model_dump()))
