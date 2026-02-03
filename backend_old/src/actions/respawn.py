from asyncio import create_task
from math import floor
from pydantic import BaseModel

from src.database.character import update_character, update_character_pos
from src.models.objects.steppable import Steppable
from src.connection_manager import ConnectionManager, GameEvent
from src.actions.action import ActionRequest
from src.gamestate import Gamestate


async def respawn(action: ActionRequest):
    database = action.request.app["database"]
    gamestate: Gamestate = action.request.app["gamestate"]
    connection_manager: ConnectionManager = action.request.app["connection_manager"]

    if not action.character.id:
        event = GameEvent(
            event="log",
            payload={"error": "Character ID not found for move action."}
        )
        return await action.ws.send_json(event.model_dump())

    character_state = gamestate.get_character_state(action.character.id)

    if character_state is None:
        event = GameEvent(
            event="log",
            payload={"error": "Character state not found for move action."}
        )
        return await action.ws.send_json(event.model_dump())

    if character_state.current_hp > 0:
        event = GameEvent(
            event="log",
            payload={"error": "Character is not dead and cannot respawn."}
        )
        return await action.ws.send_json(event.model_dump())

    # Respawn character
    character_state.x = 0
    character_state.y = 0
    character_state.current_hp = character_state.max_hp
    character_state.gold = floor(character_state.gold * 0.9)

    await update_character(database, character_state.to_character())

    return create_task(gamestate.publish_character(action.account.id, character_id=character_state.id))
