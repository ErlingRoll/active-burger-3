from aiohttp.web import Request, WebSocketResponse
from pydantic import BaseModel, ValidationError

from src.connection_manager import GameEvent
from src.actions.action import ActionRequest
from src.gamestate import Gamestate
from src.database.account import get_account_by_discord_id, create_account
from src.database.character import get_character_by_account_id, create_character
from src.models.render_object import RenderObject
from src.database.object import create_object, db_delete_object
from src.models.account import Account
from src.models.character import Character
from src.generators.object import generate_object


class PlaceObjectPayload(BaseModel):
    properties: dict


async def place_object(action: ActionRequest):
    database = action.request.app["database"]
    gamestate: Gamestate = action.request.app["gamestate"]

    payload = PlaceObjectPayload(**action.payload)
    new_object = None
    try:
        new_object = generate_object(**payload.properties)
    except ValidationError as e:
        event = GameEvent(
            event="log",
            payload={"error": f"Invalid object properties: {e.errors()}"}
        )
        return await action.ws.send_json(event.model_dump())

    render_object = await create_object(database, new_object)

    if not render_object:
        event = GameEvent(
            event="error",
            payload={"message": "Failed to create object in database."}
        )
        return await action.ws.send_json(event.model_dump())

    object = generate_object(**render_object.model_dump())

    if not object:
        event = GameEvent(
            event="error",
            payload={"message": "Failed to create object game object."}
        )
        return await action.ws.send_json(event.model_dump())

    await gamestate.add_object(object)


async def delete_object(action: ActionRequest):
    database = action.request.app["database"]
    gamestate: Gamestate = action.request.app["gamestate"]

    object_id = action.payload.get("id")

    if not object_id:
        await action.ws.send_str("Error: 'id' field is required.")
        return

    obj = gamestate.objects.get(object_id)

    if not obj:
        await action.ws.send_str("Error: Object not found.")
        return

    deleted = await db_delete_object(database, object_id)

    if not deleted:
        await action.ws.send_str("Error: Failed to delete object from database.")
        return

    await gamestate.delete_object(object_id)
