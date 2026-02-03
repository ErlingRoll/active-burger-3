from __future__ import annotations
from copy import deepcopy
from typing import TYPE_CHECKING
from random import sample

from src.generators.affixes.item_affixes import replace_item_affixes
from src.generators.dice import roll
from src.models.item import Rarity
from src.models.items.mods import item_mods
from .currency import Currency, ApplyCheckResult

if TYPE_CHECKING:
    from src.models import Equipment


class ChaosOrb(Currency):
    item_id: str = "chaos_orb"
    name: str = "Chaos Orb"
    description: str = "Use at crafting bench to upgrade a common item to a rare item"
    texture: str = "item/currency/chaos_orb"
    value: int = 20
    rarity: Rarity = Rarity.RARE

    def apply_check(self, equipment: Equipment) -> ApplyCheckResult:
        check = equipment.rarity == Rarity.RARE
        return ApplyCheckResult(
            success=check,
            message="Item is not rare" if not check else "",
        )

    def apply_to(self, equipment: Equipment) -> Equipment:
        type_mods = deepcopy(item_mods.get(equipment.type, None))
        if type_mods is None:
            return equipment

        new_mod_count = roll(max_value=4, min_value=3)
        available_mods = type_mods["mods"]

        locked_mod = equipment.get_locked_mod()
        if locked_mod is not None:
            new_mod_count -= 1
            available_mods.remove(locked_mod)
            del equipment.props['locked_mod']

        new_mods = sample(available_mods, new_mod_count)
        mod_values = type_mods["values"]

        equipment.mods = {
            mod_id: equipment.mods[mod_id] for mod_id in equipment.mods if mod_id == locked_mod
        }

        for mod_id in new_mods:
            values = mod_values.get(mod_id, None)
            tier = roll(max_value=len(values), min_value=1, luck=-1, reverse=True) - 1
            equipment.add_mod(mod_id, values[tier])

        equipment.rarity = Rarity.RARE
        replace_item_affixes(equipment)

        return equipment
