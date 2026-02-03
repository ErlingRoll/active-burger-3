from math import floor
from src.generators.dice import roll, roll_chance
from src.models.damage_hit import DamageHit
from src.models.equipment import EquipSlot, Equipment
from src.models.item import Item
from src.models.items.mods import ToolMod, WeaponMod, weapon_mod_value


class Weapon(Equipment):
    type: str = "weapon"
    equip_slot: str = EquipSlot.WEAPON.value

    def roll_hit(self) -> DamageHit:
        total_physical = self.get_mod_value(WeaponMod.PHYSICAL_DAMAGE.value) \
            * ((100 + self.get_mod_value(WeaponMod.INCREASED_DAMAGE.value)) / 100)
        total_fire = self.get_mod_value(WeaponMod.FIRE_DAMAGE.value) \
            * ((100 + self.get_mod_value(WeaponMod.INCREASED_DAMAGE.value)) / 100) \
            * ((100 + self.get_mod_value(WeaponMod.INCREASED_ELEMENTAL_DAMAGE.value)) / 100)
        total_cold = self.get_mod_value(WeaponMod.COLD_DAMAGE.value) \
            * ((100 + self.get_mod_value(WeaponMod.INCREASED_DAMAGE.value)) / 100) \
            * ((100 + self.get_mod_value(WeaponMod.INCREASED_ELEMENTAL_DAMAGE.value)) / 100)
        total_lightning = self.get_mod_value(WeaponMod.LIGHTNING_DAMAGE.value) \
            * ((100 + self.get_mod_value(WeaponMod.INCREASED_DAMAGE.value)) / 100) \
            * ((100 + self.get_mod_value(WeaponMod.INCREASED_ELEMENTAL_DAMAGE.value)) / 100)
        total_chaos = self.get_mod_value(WeaponMod.CHAOS_DAMAGE.value) \
            * ((100 + self.get_mod_value(WeaponMod.INCREASED_DAMAGE.value)) / 100)

        base_crit_chance = 0.05 + (self.get_mod_value(WeaponMod.ADDED_CRIT_CHANCE.value) / 100)
        crit_chance = base_crit_chance * ((100 + self.get_mod_value(WeaponMod.INCREASED_CRIT_CHANCE.value)) / 100)

        luck = self.get_mod_value(WeaponMod.LUCK.value)

        hit = DamageHit(
            physical=roll(floor(total_physical), 0, luck=luck),
            fire=roll(floor(total_fire), 0, luck=luck),
            cold=roll(floor(total_cold), 0, luck=luck),
            lightning=roll(floor(total_lightning), 0, luck=luck),
            chaos=roll(floor(total_chaos), 0, luck=luck),
            critical=roll_chance() < crit_chance,
            critical_multiplier=100 + self.get_mod_value(WeaponMod.CRIT_MULTIPLIER.value, 0)
        )

        return hit


class Toothpick(Weapon):
    item_id: str = "toothpick"
    name: str = "Toothpick"
    description: str = "You COULD play golf with this."
    texture: str = "item/weapon/toothpick"
    value: int = 10
    base_mods: dict[str, int] = {
        WeaponMod.PHYSICAL_DAMAGE.value: weapon_mod_value[WeaponMod.PHYSICAL_DAMAGE.value][9],
    }


class PoolNoodle(Weapon):
    item_id: str = "pool_noodle"
    name: str = "Pool Noodle"
    description: str = "It's a bit soggy, but it packs a punch!"
    texture: str = "item/weapon/pool_noodle"
    value: int = 50
    base_mods: dict[str, int] = {
        WeaponMod.PHYSICAL_DAMAGE.value: weapon_mod_value[WeaponMod.PHYSICAL_DAMAGE.value][7],
    }


class FryingPan(Weapon):
    item_id: str = "frying_pan"
    name: str = "Frying Pan"
    description: str = "Perfect for cooking up a storm... or bashing heads."
    texture: str = "item/weapon/frying_pan"
    value: int = 300
    base_mods: dict[str, int] = {
        WeaponMod.PHYSICAL_DAMAGE.value: weapon_mod_value[WeaponMod.PHYSICAL_DAMAGE.value][7],
        WeaponMod.FIRE_DAMAGE.value: weapon_mod_value[WeaponMod.FIRE_DAMAGE.value][8],
    }
