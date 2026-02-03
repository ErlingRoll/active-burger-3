
from src.models.render_object import RenderObject


class NPC(RenderObject):
    name_visible: bool = True
    solid: bool = True


class Shopkeeper(NPC):
    name: str = "Shop"
    object_id: str = "shopkeeper"
    texture: str = "npcs/shopkeeper"
