from src.models.item import Item


class Ore(Item):
    type: str = "ore"
    stackable: bool = True
    count: int = 1


class SaltOre(Ore):
    item_id: str = "salt_ore"
    name: str = "Salt Ore"
    description: str = "A chunk of salt ore. Tastes salty."
    texture: str = "terrain/ore/salt"
    value: int = 2


class CopperOre(Ore):
    item_id: str = "copper_ore"
    name: str = "Copper Ore"
    description: str = "A chunk of copper ore. Common and useful."
    texture: str = "terrain/ore/copper"
    value: int = 4


class IronOre(Ore):
    item_id: str = "iron_ore"
    name: str = "Iron Ore"
    description: str = "Iron was used in the iron age. It is also used now."
    texture: str = "terrain/ore/iron"
    value: int = 6


class SilverOre(Ore):
    item_id: str = "silver_ore"
    name: str = "Silver Ore"
    description: str = "The average league of legends rank."
    texture: str = "terrain/ore/silver"
    value: int = 10


class GoldOre(Ore):
    item_id: str = "gold_ore"
    name: str = "Gold Ore"
    description: str = "It is really heavy. Why is it so valuable?"
    texture: str = "terrain/ore/gold"
    value: int = 20


class DiamondOre(Ore):
    item_id: str = "diamond_ore"
    name: str = "Diamond Ore"
    description: str = "Shine bright like a diamond."
    texture: str = "terrain/ore/diamond"
    value: int = 100


class NetheriteOre(Ore):
    item_id: str = "netherite_ore"
    name: str = "Netherite Ore"
    description: str = "From the nether!"
    texture: str = "terrain/ore/netherite"
    value: int = 200
