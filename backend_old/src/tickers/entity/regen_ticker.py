from pydantic import BaseModel, ConfigDict
from supabase import AsyncClient
from pydantic import BaseModel
from src.models.entity import Entity
from src.connection_manager import ConnectionManager
from src.tickers.game_ticker import GameTickerInterface
from src.gamestate import Gamestate


class MonsterRegenTicker(BaseModel, GameTickerInterface):
    database: AsyncClient
    connection_manager: ConnectionManager
    gamestate: Gamestate

    model_config = ConfigDict(arbitrary_types_allowed=True)

    async def game_tick(self):
        for object in self.gamestate.objects.values():
            if not object.type == "monster":
                continue
            entity: Entity = object  # type: ignore

            if not entity.is_alive():
                continue

            entity.heal(entity.regen)
