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


class AlterationOrb(Currency):
    item_id: str = "alteration_orb"
    name: str = "Alteration Orb"
    description: str = "Use at crafting bench to re-roll mods of uncommon equipment"
    texture: str = "item/currency/alteration_orb"
    value: int = 20
    rarity: Rarity = Rarity.UNCOMMON

    def apply_check(self, equipment: Equipment) -> ApplyCheckResult:
        check = equipment.rarity == Rarity.UNCOMMON
        return ApplyCheckResult(
            success=check,
            message="Item is not uncommon rarity" if not check else "",
        )

    def apply_to(self, equipment: Equipment) -> Equipment:
        type_mods = deepcopy(item_mods.get(equipment.type, None))
        if type_mods is None:
            return equipment

        new_mod_count = roll(max_value=2, min_value=1)
        available_mods = type_mods["mods"]

        locked_mod = equipment.get_locked_mod()
        if locked_mod is not None:
            new_mod_count = 1
            available_mods.remove(locked_mod)
            del equipment.props['locked_mod']

        mod_ids = sample(available_mods, new_mod_count)
        mod_values = type_mods["values"]

        equipment.mods = {
            mod_id: equipment.mods[mod_id] for mod_id in equipment.mods if mod_id == locked_mod
        }

        for mod_id in mod_ids:
            values = mod_values.get(mod_id, None)
            tier = roll(max_value=len(values), min_value=1, luck=-1, reverse=True) - 1
            equipment.add_mod(mod_id, values[tier])

        equipment.rarity = Rarity.UNCOMMON
        replace_item_affixes(equipment)

        return equipment
