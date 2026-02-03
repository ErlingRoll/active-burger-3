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


class LockingOrb(Currency):
    item_id: str = "locking_orb"
    name: str = "Locking Orb"
    description: str = "Use at crafting bench to lock a random mod. Lock is consumed on crafting."
    texture: str = "item/currency/locking_orb"
    value: int = 1000
    rarity: Rarity = Rarity.LEGENDARY

    def apply_check(self, equipment: Equipment) -> ApplyCheckResult:
        rarity_check = equipment.rarity != Rarity.COMMON
        if not rarity_check:
            return ApplyCheckResult(
                success=False,
                message="Item has no mods to lock"
            )

        return ApplyCheckResult(success=True)

    def apply_to(self, equipment: Equipment) -> Equipment:
        type_mods = item_mods.get(equipment.type, None)
        if type_mods is None:
            return equipment

        current_mod_ids = list(equipment.mods.keys())

        locked_mod_id = choice(current_mod_ids)

        equipment.props["locked_mod"] = locked_mod_id

        return equipment
