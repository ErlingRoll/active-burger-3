
from pydantic import BaseModel


class Account(BaseModel):
    id: str
    created_at: str
    discord_id: str
    discord_avatar: str
    name: str
    admin: bool = False
