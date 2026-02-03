from aiohttp.web import Application, Request, WebSocketResponse
from pydantic import BaseModel, ConfigDict
from src.models import Account, Character


class ActionRequest(BaseModel):
    request: Request
    app: Application
    ws: WebSocketResponse
    account: Account
    character: Character
    payload: dict

    model_config = ConfigDict(arbitrary_types_allowed=True)
