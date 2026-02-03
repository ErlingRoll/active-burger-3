from asyncio import create_task
from pydantic import BaseModel

from src.generators.world import Realm
from src.connection_manager import ConnectionManager, GameEvent
from src.actions.action import ActionRequest
from src.gamestate import Gamestate


class SetRealmPayload(BaseModel):
    realm: Realm


async def set_realm(action: ActionRequest):
    gamestate: Gamestate = action.request.app["gamestate"]
    connection_manager: ConnectionManager = action.request.app["connection_manager"]

    payload = SetRealmPayload(**action.payload)

    await connection_manager.set_account_realm(action.account.id, payload.realm)

    realm_update_event = GameEvent(
        event="realm_update",
        payload={"realm": payload.realm}
    )

    await action.ws.send_json(realm_update_event.model_dump())

    create_task(gamestate.publish_gamestate(account=action.account, realm=payload.realm))
    create_task(gamestate.publish_terrain(account=action.account, realm=payload.realm))
