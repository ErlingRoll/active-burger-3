from __future__ import annotations
from typing import TYPE_CHECKING
from random import sample

from src.models.equipment import EquipSlot
from src.generators.affixes.item_affixes import replace_item_affixes
from src.generators.dice import roll
from src.models.item import Rarity
from src.models.items.mods import item_mods
from .currency import Currency, ApplyCheckResult

if TYPE_CHECKING:
    from src.models import Equipment


class CelestialOrb(Currency):
    item_id: str = "celestial_orb"
    name: str = "Celestial Orb"
    description: str = "Use at crafting bench to add 2 mods to a rare item"
    texture: str = "item/currency/celestial_orb"
    value: int = 100
    rarity: Rarity = Rarity.EPIC

    def apply_check(self, equipment: Equipment) -> ApplyCheckResult:
        type_check = equipment.type == EquipSlot.ARMOR.value \
            or equipment.type == EquipSlot.WEAPON.value
        if not type_check:
            return ApplyCheckResult(
                success=False,
                message="Can only be applied to weapons or armor"
            )

        rarity_check = equipment.rarity == Rarity.RARE
        if not rarity_check:
            return ApplyCheckResult(
                success=False,
                message="Item is not rare"
            )

        return ApplyCheckResult(success=True)

    def apply_to(self, equipment: Equipment) -> Equipment:
        type_mods = item_mods.get(equipment.type, None)
        if type_mods is None:
            return equipment

        mod_ids = type_mods["mods"]
        mod_values = type_mods["values"]

        current_mod_ids = list(equipment.mods.keys())
        available_mod_ids = [mod_id for mod_id in mod_ids if mod_id not in current_mod_ids]

        new_mod_ids = sample(available_mod_ids, 2)

        for mod_id in new_mod_ids:
            values = mod_values.get(mod_id, None)
            tier = roll(max_value=len(values), min_value=1, luck=-1, reverse=True) - 1
            equipment.add_mod(mod_id, values[tier])

        equipment.rarity = Rarity.EPIC
        replace_item_affixes(equipment)

        return equipment
