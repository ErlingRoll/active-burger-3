
from src.models.render_object import RenderObject


class TerrainObject(RenderObject):
    type: str = "terrain"
    name_visible: bool = False
    solid: bool = True


class Rock(TerrainObject):
    name: str = "Rock"
    object_id: str = "rock"
    texture: str = "terrain/rock"


class Bush(TerrainObject):
    name: str = "Bush"
    object_id: str = "bush"
    texture: str = "terrain/bush"
