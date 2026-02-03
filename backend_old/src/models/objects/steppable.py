
from __future__ import annotations
from typing import TYPE_CHECKING

from supabase import AsyncClient

from src.connection_manager import ConnectionManager
from src.models import RenderObject

if TYPE_CHECKING:
    from src.gamestate import Gamestate
    from src.models import Account, Character


class Steppable(RenderObject):
    solid: bool = False
    name_visible: bool = False

    async def on_step(self, database: AsyncClient, gamestate: Gamestate, connection_manager: ConnectionManager, flags: dict, account: Account, character: Character) -> None:
        raise NotImplementedError("on_step must be implemented by subclasses")
