from asyncio import create_task
from pydantic import BaseModel

from src.database.character import update_character
from src.connection_manager import GameEvent
from src.actions.action import ActionRequest
from src.gamestate import ChatMessage, Gamestate


class SendChatMessagePayload(BaseModel):
    message: str


MAX_CHAT_MESSAGE_LENGTH = 200


async def send_chat_message(action: ActionRequest):
    gamestate: Gamestate = action.request.app["gamestate"]
    payload = SendChatMessagePayload(**action.payload)

    if not action.character.id:
        event = GameEvent(
            event="log",
            payload={"error": "Character ID not found for send_chat_message action."}
        )
        return await action.ws.send_json(event.model_dump())

    message = ChatMessage(
        account_id=action.account.id,
        account_name=action.account.name,
        character_id=action.character.id,
        character_name=action.character.name,
        message=payload.message[:MAX_CHAT_MESSAGE_LENGTH],
    )

    create_task(gamestate.send_chat_message(message))
