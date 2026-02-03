from __future__ import annotations
from typing import TYPE_CHECKING
from random import choice, sample

from src.generators.affixes.item_affixes import replace_item_affixes
from src.generators.dice import roll
from src.models.item import Rarity
from src.models.items.mods import item_mods
from .currency import Currency, ApplyCheckResult

if TYPE_CHECKING:
    from src.models import Equipment


class ExaltedOrb(Currency):
    item_id: str = "exalted_orb"
    name: str = "Exalted Orb"
    description: str = "Use at crafting bench to add up to 4 mods to an item"
    texture: str = "item/currency/exalted_orb"
    value: int = 100
    rarity: Rarity = Rarity.RARE

    def apply_check(self, equipment: Equipment) -> ApplyCheckResult:
        rarity_check = equipment.rarity == Rarity.UNCOMMON or equipment.rarity == Rarity.RARE
        if not rarity_check:
            return ApplyCheckResult(
                success=False,
                message="Item is not uncommon or rare"
            )

        mod_check = len(equipment.mods) < 4
        if not mod_check:
            return ApplyCheckResult(
                success=False,
                message="Item already has more than 3 mods"
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

        new_mod_id = choice(available_mod_ids)
        values = mod_values.get(new_mod_id, None)
        tier = roll(max_value=len(values), min_value=1, luck=-1, reverse=True) - 1
        equipment.add_mod(new_mod_id, values[tier])

        equipment.update_rarity()

        replace_item_affixes(equipment)

        return equipment
