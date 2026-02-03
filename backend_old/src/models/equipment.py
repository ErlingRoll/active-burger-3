from enum import Enum
from typing import Optional
from pydantic import BaseModel

from src.models.item import Rarity
from src.models import Item


class EquipSlot(Enum):
    WEAPON = "weapon"
    ARMOR = "armor"
    PICKAXE = "pickaxe"


class EquipmentSlot(BaseModel):
    id: Optional[str] = None
    created_at: Optional[str] = None
    character_id: Optional[str] = None
    slot: Optional[str] = None

    item_id: Optional[str] = None
    item: Optional[Item] = None


class Equipment(Item):
    type: str = "equipment"
    stackable: bool = False
    count: int = 1
    equipable: bool = True
    base_mods: dict[str, int] = {}
    mods: dict[str, int] = {}
    durability: int = 100

    def update_rarity(self) -> Rarity:
        mod_count = len(self.mods)
        if mod_count == 0:
            self.rarity = Rarity.COMMON
        elif mod_count <= 2:
            self.rarity = Rarity.UNCOMMON
        elif mod_count <= 4:
            self.rarity = Rarity.RARE
        elif mod_count <= 6:
            self.rarity = Rarity.EPIC
        return self.rarity
