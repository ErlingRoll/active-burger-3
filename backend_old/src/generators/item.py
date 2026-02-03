from src.models.item import Item
from src.models.food import BalkanKebab, Burger
from src.models.items import GoldOre, Pickaxe
from src.models.items.currency import ChaosOrb, AlchemyOrb, ScouringOrb, AlterationOrb, TransmutationOrb, ExaltedOrb, CelestialOrb, AnnulmentOrb, LockingOrb
from src.models.items.weapon import Toothpick, FryingPan, PoolNoodle
from src.models.items.armor import Hoodie

food_map = {
    "burger": Burger,
    "balkan_kebab": BalkanKebab,
}

weapon_map = {
    "toothpick": Toothpick,
    "pool_noodle": PoolNoodle,
    "frying_pan": FryingPan,
}

armor_map = {
    "hoodie": Hoodie,
}

resource_map = {
    "gold_ore": GoldOre,
}

tool_map = {
    "pickaxe": Pickaxe,
}

currency_map = {
    "scouring_orb": ScouringOrb,
    "transmutation_orb": TransmutationOrb,
    "alteration_orb": AlterationOrb,
    "alchemy_orb": AlchemyOrb,
    "chaos_orb": ChaosOrb,
    "exalted_orb": ExaltedOrb,
    "celestial_orb": CelestialOrb,
    "annulment_orb": AnnulmentOrb,
    "locking_orb": LockingOrb,
}

item_map = {**food_map, **weapon_map, **armor_map, **resource_map, **tool_map, **currency_map}


def generate_item(item_id: str = "", **kwargs) -> Item:
    item_class = item_map.get(item_id)
    if item_class:
        return item_class(**kwargs)
    else:
        raise ValueError(f"Unknown item_id: {item_id}")
