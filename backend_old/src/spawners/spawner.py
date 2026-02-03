from random import random, randint
from pydantic import BaseModel, ConfigDict
from supabase import AsyncClient
from typing import Dict, List, Literal
from pydantic import BaseModel
from src.generators.world import Realm
from src.database.object import create_object
from src.generators.monster import generate_monster
from src.generators.object import generate_object
from src.models.render_object import RenderObject
from src.connection_manager import ConnectionManager
from src.tickers.game_ticker import GameTickerInterface
from src.gamestate import Gamestate


class SpawnTableItem(BaseModel):
    object_id: str
    chance: float  # 0.0 to 1.0


class SpawnTable(BaseModel):
    items: List[SpawnTableItem]

    def roll_spawn(self) -> str | None:
        for item in self.items:
            roll = random()
            if roll <= item.chance:
                return item.object_id

    def roll_spawn_multiple(self) -> List[RenderObject]:
        spawn_items = []
        for item in self.items:
            roll = random()
            if roll <= item.chance:
                spawn_items.append(item)

        return spawn_items


class Spawner(BaseModel, GameTickerInterface):
    database: AsyncClient
    connection_manager: ConnectionManager
    gamestate: Gamestate
    start_x: int
    start_y: int
    end_x: int
    end_y: int
    realm: Realm
    object_type: Literal["object", "monster"] = "object"
    safe_radius: int = 1
    spawn_table: SpawnTable

    model_config = ConfigDict(arbitrary_types_allowed=True)

    def random_position(self) -> tuple[int, int]:
        x = randint(self.start_x, self.end_x)
        y = randint(self.start_y, self.end_y)
        return x, y

    async def game_tick(self):
        random_position = self.random_position()

        blocked_spawn = self.gamestate.is_pos_blocked(x=random_position[0], y=random_position[1], realm=self.realm)
        if blocked_spawn:
            return

        neighboring_objects: Dict[str, RenderObject] = self.gamestate.get_render_object_window(
            x_start=random_position[0] - self.safe_radius,
            y_start=random_position[1] - self.safe_radius,
            x_end=random_position[0] + self.safe_radius,
            y_end=random_position[1] + self.safe_radius,
        )

        has_space = True
        for obj in neighboring_objects.values():
            if obj.type in ["character"]:
                has_space = False
                break
            if obj.solid and obj.type not in ["object", "terrain"]:
                has_space = False
                break

        if not has_space:
            return

        object_id = self.spawn_table.roll_spawn()
        if not object_id:
            return

        new_object = None

        if self.object_type == "object":
            new_object = generate_object(object_id=object_id, x=random_position[0], y=random_position[1], realm=self.realm)
        elif self.object_type == "monster":
            new_object = generate_monster(object_id=object_id, x=random_position[0], y=random_position[1], realm=self.realm)

        if not new_object:
            raise ValueError(f"Could not generate object for id: {object_id}")

        created_object = await create_object(self.database, new_object)

        if created_object:
            await self.gamestate.add_object(created_object, skip_publish=True)
