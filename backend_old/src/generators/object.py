
from src.generators.monster import generate_monster
from src.models.objects.misc.teleporter import Teleporter
from src.models.npcs.npcs import Shopkeeper
from src.models.objects.terrain import Rock, Bush
from src.models.render_object import RenderObject
from src.models.objects.entity.ore.gold_ore import GoldOre
from src.models.objects.misc.crafting_table import CraftingBench

object_map = {
    "rock": Rock,
    "bush": Bush,
    "gold_ore": GoldOre,
    "shopkeeper": Shopkeeper,
    "crafting_bench": CraftingBench,
    "teleporter": Teleporter,
}


def generate_object(object_id, **kwargs) -> RenderObject:
    # Note that this "object_id" is the type identifier, not the unique instance ID

    object_class = object_map.get(object_id)

    if not object_class:
        object_class = generate_monster(object_id, **kwargs)
        if object_class:
            return object_class  # type: ignore

    if object_class:
        return object_class(**kwargs)  # type: ignore
    else:
        raise ValueError(f"Unknown object_id: {object_id}")
