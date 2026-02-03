from asyncio import create_task
from pydantic import BaseModel

from src.database.character import update_character_pos
from src.models.objects.steppable import Steppable
from src.connection_manager import ConnectionManager, GameEvent
from src.actions.action import ActionRequest
from src.gamestate import Gamestate


class MovePayload(BaseModel):
    x: int
    y: int
    direction: str


async def move(action: ActionRequest):
    database = action.request.app["database"]
    gamestate: Gamestate = action.request.app["gamestate"]
    connection_manager: ConnectionManager = action.request.app["connection_manager"]
    payload = MovePayload(**action.payload)

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

    # Abandon move if character is in another realm. Probably means they teleported.
    if character_state.realm != action.character.realm:
        return await gamestate.publish_gamestate()

    character_state.direction = payload.direction

    blocked = gamestate.is_pos_blocked(x=payload.x, y=payload.y, realm=character_state.realm)
    if blocked:
        print("Changed direction but position blocked")
        create_task(update_character_pos(database, character_state.id, character_state.x, character_state.y, payload.direction))
        return await gamestate.publish_gamestate()

    action_flags = {"has_moved": False}

    objects_at_pos = gamestate.position_objects(realm=character_state.realm).get(f"{payload.x}_{payload.y}", [])
    for obj in objects_at_pos:
        if isinstance(obj, Steppable):
            await obj.on_step(database, gamestate, connection_manager, action_flags, action.account, action.character)

    if not action_flags["has_moved"]:
        character_state.x = payload.x
        character_state.y = payload.y
        create_task(update_character_pos(database, character_state.id, character_state.x, character_state.y, payload.direction))
        create_task(gamestate.publish_gamestate())
