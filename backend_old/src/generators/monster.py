
from src.models.objects.monster import Monster, KaratePanda, Vampire, Guardian, Demon, Gargoyle, Archmage, Guardian


object_map = {
    "karate_panda": KaratePanda,
    "vampire": Vampire,
    "guardian": Guardian,
    "demon": Demon,
    "gargoyle": Gargoyle,
    "archmage": Archmage,
}


def generate_monster(object_id, **kwargs) -> Monster:
    # Note that this "object_id" is the type identifier, not the unique instance ID

    object_class = object_map.get(object_id)
    if object_class:
        return object_class(**kwargs)
    else:
        raise ValueError(f"Unknown object_id: {object_id}")
