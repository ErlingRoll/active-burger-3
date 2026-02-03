from src.models.items.mods import WeaponMod
from src.models.objects.loot_table import LootTable, LootTableItem
from .monster import Monster


class KaratePanda(Monster):
    name: str = "Karate Panda"
    object_id: str = "karate_panda"
    texture: str = "monster/karate_panda"
    level: int = 1
    max_hp: int = 35
    current_hp: int = 35
    power: int = 7
    expDrop: int = 10
    props: dict = {
        "weapon_mods": {
            WeaponMod.PHYSICAL_DAMAGE.value: 10,
            WeaponMod.ADDED_CRIT_CHANCE.value: 5,
        }
    }

    loot_table: LootTable = LootTable(
        items=[
            LootTableItem(item_id="scouring_orb", chance=0.1, amount=1, random_amount=2),
            LootTableItem(item_id="transmutation_orb", chance=0.3, amount=1, random_amount=2),
            LootTableItem(item_id="alteration_orb", chance=0.5, amount=2, random_amount=2),
            LootTableItem(item_id="alchemy_orb", chance=0.1, amount=1, random_amount=2),
            LootTableItem(item_id="chaos_orb", chance=0.1, amount=1, random_amount=2),
            LootTableItem(item_id="exalted_orb", chance=0.05, amount=1, random_amount=0),
            LootTableItem(item_id="celestial_orb", chance=0.001, amount=1, random_amount=0),
            # LootTableItem(item_id="locking_orb", chance=1, amount=1000, random_amount=0),
        ]
    )
