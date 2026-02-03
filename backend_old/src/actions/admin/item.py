from asyncio import create_task
from pydantic import BaseModel

from src.actions.action import ActionRequest
from src.actions.item import add_or_stack_items
from src.gamestate import Gamestate
from src.database.account import get_account_by_discord_id, create_account
from src.database.character import get_character_by_account_id, create_character, get_character_data_by_id
from src.models.character import Character, CharacterData
from src.models.account import Account
from src.generators.item import generate_item
from src.database.item import create_item


class GiveItemPayload(BaseModel):
    item_id: str


async def give_item(action: ActionRequest):
    gamestate: Gamestate = action.request.app["gamestate"]
    database = action.request.app["database"]
    payload = GiveItemPayload(**action.payload)

    new_item = generate_item(payload.item_id)
    new_item.character_id = action.character.id

    character_data: CharacterData = await get_character_data_by_id(database, action.character.id)

    await add_or_stack_items(database, character_data, [new_item])

    create_task(gamestate.publish_character(action.account.id, character_id=action.character.id))
