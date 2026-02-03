from src.models.render_object import RenderObject


class CraftingBench(RenderObject):
    object_id: str = "crafting_bench"
    name: str = "Crafting Bench"
    name_visible: bool = True
    texture: str = "misc/crafting_bench"
    solid: bool = True
