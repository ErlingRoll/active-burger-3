from supabase_auth import Any
from src.models.items.mods import WeaponMod
from src.models.objects.loot_table import LootTable, LootTableItem
from .monster import Monster


class Gargoyle(Monster):
    name: str = "Gargoyle"
    object_id: str = "gargoyle"
    texture: str = "monster/gargoyle"
    level: int = 15
    max_hp: int = 500
    current_hp: int = 500
    regen: int = 5
    power: int = 14
    expDrop: int = 150
    props: dict[str, Any] = {
        "weapon_mods": {
            WeaponMod.PHYSICAL_DAMAGE.value: 200,
            WeaponMod.ADDED_CRIT_CHANCE.value: 20,
        }
    }

    loot_table: LootTable = LootTable(
        items=[
            # LootTableItem(item_id="burger", chance=0.2, amount=3),
            # LootTableItem(item_id="scouring_orb", chance=0.1, amount=1, random_amount=2),
            # LootTableItem(item_id="transmutation_orb", chance=0.2, amount=1, random_amount=2),
            # LootTableItem(item_id="alteration_orb", chance=0.5, amount=2, random_amount=5),
            # LootTableItem(item_id="alchemy_orb", chance=0.1, amount=1, random_amount=3),
            LootTableItem(item_id="chaos_orb", chance=1, amount=3, random_amount=10),
            LootTableItem(item_id="exalted_orb", chance=0.1, amount=1, random_amount=5),
            LootTableItem(item_id="annulment_orb", chance=0.1, amount=1, random_amount=5),
            LootTableItem(item_id="celestial_orb", chance=0.05, amount=1, random_amount=0),
        ]
    )
