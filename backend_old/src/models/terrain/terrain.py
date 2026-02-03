from typing import Optional
from pydantic import BaseModel, ConfigDict

from src.generators.world import Realm


class Terrain(BaseModel):
    id: str
    created_at: str
    name: str
    game_id: str
    texture: str
    x: int
    y: int
    z: int
    realm: Realm
    solid: bool = False
    opacity: float = 1.0
    rotation: int = 0
    ext: Optional[str] = None
    model_config = ConfigDict(use_enum_values=True)

    def to_db_model(self) -> "Terrain":
        return Terrain.model_construct(**self.model_dump())

    def prep_db(self) -> dict:
        data = self.to_db_model().model_dump()
        remove_keys = ["id", "created_at"]
        for key in remove_keys:
            data.pop(key, None)
        return data


class Color(Terrain):
    name: str = "Color"
    game_id: str = "color"
    texture: str = "terrain/color"
    solid: bool = False


class WoodPost(Terrain):
    name: str = "Wood Post"
    game_id: str = "wood_post"
    solid: bool = True


class Grass(Terrain):
    name: str = "Grass"
    game_id: str = "grass"
    texture: str = "terrain/grass"
    solid: bool = False


class Water(Terrain):
    name: str = "Water"
    game_id: str = "water"
    texture: str = "terrain/water"
    solid: bool = True


class WaterWave(Terrain):
    name: str = "Water Wave"
    game_id: str = "water_wave"
    texture: str = "terrain/water_wave"
    solid: bool = True
    ext: str = "gif"


class Rock(Terrain):
    name: str = "Rock"
    game_id: str = "rock"
    texture: str = "terrain/rock"
    solid: bool = True


class RockFloor(Terrain):
    name: str = "Rock Floor"
    game_id: str = "rock_floor"
    texture: str = "terrain/rock_floor"
    solid: bool = False


class Bush(Terrain):
    name: str = "Bush"
    game_id: str = "bush"
    texture: str = "terrain/bush"
    solid: bool = True


class Sandstone(Terrain):
    name: str = "Sandstone"
    game_id: str = "sandstone"
    texture: str = "terrain/sandstone"
    solid: bool = False
# texture ref old


class Woodplank(Terrain):
    name: str = "Woodplank"
    game_id: str = "woodplank"
    texture: str = "terrain/woodplank/woodplank"
    solid: bool = False


class Dirt(Terrain):
    name: str = "Dirt"
    game_id: str = "dirt"
    texture: str = "terrain/dirt/dirt"
    solid: bool = False


class Sand(Terrain):
    name: str = "Sand"
    game_id: str = "sand"
    texture: str = "terrain/sand/sand"
    solid: bool = False


class Beachwater(Terrain):
    name: str = "Beachwater"
    game_id: str = "beachwater"
    texture: str = "terrain/beachwater/beachwater"
    solid: bool = False


class StoneWall(Terrain):
    name: str = "Stone Wall"
    game_id: str = "stone_wall"
    texture: str = "terrain/stone_wall/stone_wall"
    solid: bool = True
