from __future__ import annotations
from typing import TYPE_CHECKING
from random import sample

from src.generators.affixes.item_affixes import replace_item_affixes
from src.generators.dice import roll
from src.models.item import Rarity
from src.models.items.mods import item_mods
from .currency import Currency, ApplyCheckResult

if TYPE_CHECKING:
    from src.models import Equipment


class AlchemyOrb(Currency):
    item_id: str = "alchemy_orb"
    name: str = "Alchemy Orb"
    description: str = "Use at crafting bench to upgrade a common item to a rare item"
    texture: str = "item/currency/alchemy_orb"
    value: int = 10
    rarity: Rarity = Rarity.RARE

    def apply_check(self, equipment: Equipment) -> ApplyCheckResult:
        check = equipment.rarity == Rarity.COMMON
        return ApplyCheckResult(
            success=check,
            message="Item is not common rarity" if not check else "",
        )

    def apply_to(self, equipment: Equipment) -> Equipment:
        type_mods = item_mods.get(equipment.type, None)
        if type_mods is None:
            return equipment

        new_mod_count = roll(max_value=4, min_value=3, luck=-1)

        mod_ids = sample(type_mods["mods"], new_mod_count)
        mod_values = type_mods["values"]

        equipment.mods = {}

        for mod_id in mod_ids:
            values = mod_values.get(mod_id, None)
            tier = roll(max_value=len(values), min_value=1, luck=-2, reverse=True) - 1
            equipment.add_mod(mod_id, values[tier])

        equipment.rarity = Rarity.RARE
        replace_item_affixes(equipment)

        return equipment
