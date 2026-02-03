from __future__ import annotations
from copy import deepcopy
from typing import TYPE_CHECKING
from random import choice, sample

from src.generators.affixes.item_affixes import remove_item_affixes, replace_item_affixes
from src.generators.dice import roll
from src.models.item import Rarity
from src.models.items.mods import item_mods
from .currency import Currency, ApplyCheckResult

if TYPE_CHECKING:
    from src.models import Equipment


class AnnulmentOrb(Currency):
    item_id: str = "annulment_orb"
    name: str = "Annulment Orb"
    description: str = "Use at crafting bench to remove a random mod from an item"
    texture: str = "item/currency/annulment_orb"
    value: int = 100
    rarity: Rarity = Rarity.RARE

    def apply_check(self, equipment: Equipment) -> ApplyCheckResult:
        mod_check = len(equipment.mods) > 0
        if not mod_check:
            return ApplyCheckResult(
                success=False,
                message="Item has no mods to remove"
            )

        return ApplyCheckResult(success=True)

    def apply_to(self, equipment: Equipment) -> Equipment:
        type_mods = deepcopy(item_mods.get(equipment.type, None))
        if type_mods is None:
            return equipment

        current_mod_ids = list(equipment.mods.keys())

        locked_mod = equipment.get_locked_mod()
        if locked_mod is not None:
            current_mod_ids.remove(locked_mod)
            del equipment.props['locked_mod']

        removed_mod_id = choice(current_mod_ids)

        del equipment.mods[removed_mod_id]

        new_rarity = equipment.update_rarity()

        if new_rarity == Rarity.COMMON:
            remove_item_affixes(equipment)

        return equipment
