from asyncio import create_task
from random import choice
from aiohttp.web import Request, WebSocketResponse
from pydantic import BaseModel

from src.connection_manager import ConnectionManager, GameEvent
from src.gamestate import Gamestate
from src.database.account import get_account_by_discord_id, create_account
from src.database.character import get_character_by_account_id, create_character, get_character_data_by_id
from src.models import Account, Character, CharacterData


def create_login_message(character_name: str) -> str:
    messages = [
        f"A wild <b>{character_name}</b> appears",
        f"Where did <b>{character_name}</b> come from?",
        f"Trumpets sound as <b>{character_name}</b> joins the fray!",
        f"The forgotten hero <b>{character_name}</b> returns!",
        f"Whoa! It's <b>{character_name}</b>!",
        f"Jesus Christ, it's <b>{character_name}</b>!",
        f"Everyone RUN! <b>{character_name}</b> is here!",
        f"<b>{character_name}</b> rises from the ashes!",
    ]
    return choice(messages)


class LoginPayload(BaseModel):
    discord_id: str
    discord_avatar: str | None = None
    name: str | None = None


async def login(request: Request, ws: WebSocketResponse, account: Account | None, payload: dict):
    database = request.app["database"]
    gamestate: Gamestate = request.app["gamestate"]
    connection_manager: ConnectionManager = request.app["connection_manager"]

    payload: LoginPayload = LoginPayload(**payload)

    account: Account = await get_account_by_discord_id(database, payload.discord_id)

    if not account:
        new_account: Account = Account.model_construct(**payload.model_dump())
        account = await create_account(database, new_account)

    # Automatically create a character for the new account.
    # Add character selection logic later

    if not account:
        await ws.send_str("Error: Failed to create account.")
        return

    character: Character = await get_or_create_character(request, ws, account)

    # Save connection info to websocket
    connection_manager.update_account_map(account.id, ws, character.realm)

    character_data: CharacterData = await get_character_data_by_id(database, character.id)

    await gamestate.add_character(character)

    await gamestate.publish_terrain(account=account)

    realm_update_event = GameEvent(
        event="realm_update",
        payload={"realm": character.realm}
    )

    if ws.closed:
        return

    await ws.send_json(realm_update_event.model_dump())

    login_event = GameEvent(
        event="login_success",
        payload={
            "account": account,
            "character": character_data.model_dump()
        }
    )

    await ws.send_json(login_event.model_dump())
    await gamestate.publish_gamestate(account=account)

    login_message = create_login_message(character.name)

    create_task(gamestate.send_system_message(login_message))


async def get_or_create_character(request: Request, ws: WebSocketResponse, account: Account) -> Character:
    database = request.app["database"]

    character: Character = await get_character_by_account_id(database, account.id)

    if not character:
        new_character = Character.model_construct(account_id=account.id, name=account.name or "Newbie")
        character = await create_character(database, new_character)

    if not character:
        await ws.send_str("Error: Failed to create character.")
        return

    return character
