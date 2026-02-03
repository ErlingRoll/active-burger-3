from __future__ import annotations
from typing import TYPE_CHECKING

from src.generators.affixes.item_affixes import remove_item_affixes
from src.models.equipment import Equipment
from src.models.item import Rarity
from .currency import Currency, ApplyCheckResult

if TYPE_CHECKING:
    from src.models import Equipment


class ScouringOrb(Currency):
    item_id: str = "scouring_orb"
    name: str = "Scouring Orb"
    description: str = "Use at crafting bench to remove all mods from equipment"
    texture: str = "item/currency/scouring_orb"
    value: int = 20
    rarity: Rarity = Rarity.RARE

    def apply_check(self, equipment: Equipment) -> ApplyCheckResult:
        check = equipment.rarity != Rarity.COMMON
        return ApplyCheckResult(
            success=check,
            message="Item is common rarity" if not check else "",
        )

    def apply_to(self, equipment: Equipment) -> Equipment:
        locked_mod = equipment.get_locked_mod()
        if locked_mod is not None:
            del equipment.props['locked_mod']

        equipment.mods = {
            mod_id: equipment.mods[mod_id] for mod_id in equipment.mods if mod_id == locked_mod
        }

        equipment.update_rarity()
        remove_item_affixes(equipment)
        return equipment
