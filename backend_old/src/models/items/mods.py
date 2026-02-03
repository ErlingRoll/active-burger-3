
from enum import Enum


class ItemModType(Enum):
    TOOL = "tool"
    WEAPON = "weapon"
    ARMOR = "armor"


class ToolMod(Enum):
    EFFICIENCY = "efficiency"
    INCREASED_EFFICIENCY = "increased_efficiency"
    FORTUNE = "fortune"
    LUCK = "luck"


tool_mod_value = {
    ToolMod.EFFICIENCY.value: [200, 170, 150, 100, 70, 40, 20, 12, 8, 5],
    ToolMod.INCREASED_EFFICIENCY.value: [100, 80, 60, 40, 30, 20, 15, 10, 7, 5],
    ToolMod.FORTUNE.value: [10, 7, 5, 4, 3, 3, 2, 2, 1, 1],
    ToolMod.LUCK.value: [7, 6, 5, 4, 3, 2, 2, 1, 1, 1]
}


class WeaponMod(Enum):
    PHYSICAL_DAMAGE = "physical_damage"
    FIRE_DAMAGE = "fire_damage"
    COLD_DAMAGE = "cold_damage"
    LIGHTNING_DAMAGE = "lightning_damage"
    CHAOS_DAMAGE = "chaos_damage"
    INCREASED_DAMAGE = "increased_damage"
    INCREASED_ELEMENTAL_DAMAGE = "increased_elemental_damage"
    ADDED_CRIT_CHANCE = "added_crit_chance"
    INCREASED_CRIT_CHANCE = "increased_crit_chance"
    CRIT_MULTIPLIER = "crit_multiplier"
    LUCK = "luck"
    FORTUNE = "fortune"


weapon_mod_value = {
    WeaponMod.PHYSICAL_DAMAGE.value: [100, 70, 50, 30, 20, 15, 10, 7, 5, 3],
    WeaponMod.FIRE_DAMAGE.value: [80, 60, 40, 25, 15, 10, 7, 5, 3, 2],
    WeaponMod.COLD_DAMAGE.value: [80, 60, 40, 25, 15, 10, 7, 5, 3, 2],
    WeaponMod.LIGHTNING_DAMAGE.value: [80, 60, 40, 25, 15, 10, 7, 5, 3, 2],
    WeaponMod.CHAOS_DAMAGE.value: [100, 80, 60, 40, 30, 20, 15, 10, 7, 5],
    WeaponMod.INCREASED_DAMAGE.value: [100, 80, 60, 40, 30, 20, 15, 10, 7, 5],
    WeaponMod.INCREASED_ELEMENTAL_DAMAGE.value: [100, 80, 60, 40, 30, 20, 15, 10, 7, 5],
    WeaponMod.ADDED_CRIT_CHANCE.value: [30, 20, 15, 12, 10, 8, 6, 5],
    WeaponMod.INCREASED_CRIT_CHANCE.value: [100, 80, 70, 50, 40, 30, 20, 10],
    WeaponMod.CRIT_MULTIPLIER.value: [200, 170, 150, 130, 120, 100, 80, 60, 40, 20],
    WeaponMod.LUCK.value: [7, 6, 5, 4, 3, 2, 2, 1, 1, 1],
    WeaponMod.FORTUNE.value: [10, 7, 5, 4, 3, 3, 2, 2, 1, 1],
}


class ArmorMod(Enum):
    MAX_HP = "max_hp"
    INCREASED_HP = "increased_hp"
    PHYSICAL_RESISTANCE = "physical_resistance"
    ELEMENTAL_RESISTANCE = "elemental_resistance"
    FIRE_RESISTANCE = "fire_resistance"
    COLD_RESISTANCE = "cold_resistance"
    LIGHTNING_RESISTANCE = "lightning_resistance"
    CHAOS_RESISTANCE = "chaos_resistance"
    REFLECT = "reflect"


armor_mod_value = {
    ArmorMod.MAX_HP.value: [1000, 700, 500, 400, 300, 200, 150, 130, 100, 80, 60, 40, 20],
    ArmorMod.INCREASED_HP.value: [100, 80, 60, 40, 30, 20, 15, 10, 7, 5],
    ArmorMod.PHYSICAL_RESISTANCE.value: [50, 45, 40, 30, 35, 20, 15, 10, 7, 5],
    ArmorMod.ELEMENTAL_RESISTANCE.value: [30, 25, 20, 15, 12, 10, 7, 5],
    ArmorMod.FIRE_RESISTANCE.value: [50, 45, 40, 30, 35, 20, 15, 10, 7, 5],
    ArmorMod.COLD_RESISTANCE.value: [50, 45, 40, 30, 35, 20, 15, 10, 7, 5],
    ArmorMod.LIGHTNING_RESISTANCE.value: [50, 45, 40, 30, 35, 20, 15, 10, 7, 5],
    ArmorMod.CHAOS_RESISTANCE.value: [50, 45, 40, 30, 35, 20, 15, 10, 7, 5],
    ArmorMod.REFLECT.value: [70, 60, 50, 40, 30, 20, 15, 10, 7, 5],
}


item_mods = {
    ItemModType.TOOL.value: {
        "mods": [enum.value for enum in ToolMod],
        "values": tool_mod_value,
    },
    ItemModType.WEAPON.value: {
        "mods": [enum.value for enum in WeaponMod],
        "values": weapon_mod_value,
    },
    ItemModType.ARMOR.value: {
        "mods": [enum.value for enum in ArmorMod],
        "values": armor_mod_value,
    }
}
