from supabase_auth import Any
from src.models.items.mods import WeaponMod
from src.models.objects.loot_table import LootTable, LootTableItem
from .monster import Monster


class Archmage(Monster):
    name: str = "Archmage"
    object_id: str = "archmage"
    texture: str = "monster/archmage"
    level: int = 30
    max_hp: int = 1000
    current_hp: int = 1000
    regen: int = 10
    power: int = 14
    expDrop: int = 500
    props: dict[str, Any] = {
        "weapon_mods": {
            WeaponMod.FIRE_DAMAGE.value: 200,
            WeaponMod.LIGHTNING_DAMAGE.value: 200,
            WeaponMod.COLD_DAMAGE.value: 200,
            WeaponMod.ADDED_CRIT_CHANCE.value: 30,
        }
    }

    loot_table: LootTable = LootTable(
        items=[
            # LootTableItem(item_id="burger", chance=0.2, amount=3),
            # LootTableItem(item_id="scouring_orb", chance=0.1, amount=1, random_amount=2),
            # LootTableItem(item_id="transmutation_orb", chance=0.2, amount=1, random_amount=2),
            # LootTableItem(item_id="alteration_orb", chance=0.5, amount=2, random_amount=5),
            # LootTableItem(item_id="alchemy_orb", chance=0.1, amount=1, random_amount=3),
            # LootTableItem(item_id="chaos_orb", chance=1, amount=2, random_amount=10),
            LootTableItem(item_id="exalted_orb", chance=1, amount=1, random_amount=2),
            LootTableItem(item_id="annulment_orb", chance=1, amount=1, random_amount=2),
            LootTableItem(item_id="celestial_orb", chance=1, amount=1, random_amount=1),
            LootTableItem(item_id="locking_orb", chance=1, amount=1, random_amount=1),
        ]
    )
