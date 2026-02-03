from enum import Enum
from typing import Any, List, Optional
from pydantic import BaseModel


class Rarity(str, Enum):
    COMMON = "common"
    UNCOMMON = "uncommon"
    RARE = "rare"
    EPIC = "epic"
    LEGENDARY = "legendary"
    ARTIFACT = "artifact"


class UseResult(BaseModel):
    success: bool
    log: List[str] | None = []


class Item(BaseModel):
    id: Optional[str] = None
    created_at: Optional[str] = None
    item_id: Optional[str] = None
    character_id: Optional[str] = None
    name: str
    description: Optional[str] = None
    texture: str
    value: Optional[int] = None
    type: str = "item"
    stackable: Optional[bool] = False
    count: Optional[int] = 1
    consumable: Optional[bool] = False
    base_mods: dict = {}
    mods: dict = {}
    equipable: Optional[bool] = False
    equip_slot: Optional[str] = None
    rarity: Rarity = Rarity.COMMON
    props: dict[str, Any] = {}

    async def use(self, *args, **kwargs) -> UseResult:
        return UseResult(success=False, log=[f"Item [{self.name}] cannot be used."])

    def add_mod(self, mod_id: str, value: int):
        self.mods[mod_id] = value

    def get_all_mods(self):
        total_mods = self.base_mods.copy()
        for mod_id, value in self.mods.items():
            if mod_id in total_mods:
                total_mods[mod_id] += value
            else:
                total_mods[mod_id] = value
        return total_mods

    def get_mod_value(self, mod_id: str, default=0) -> int:
        all_mods = self.get_all_mods()
        return all_mods.get(mod_id, default)

    def get_locked_mod(self) -> str | None:
        return self.props.get("locked_mod", None)

    def to_item(self):
        # Only DB model fields
        return Item(
            id=self.id,
            item_id=self.item_id,
            character_id=self.character_id,
            name=self.name,
            description=self.description,
            texture=self.texture,
            value=self.value,
            type=self.type,
            stackable=self.stackable,
            count=self.count,
            consumable=self.consumable,
            base_mods=self.base_mods,
            mods=self.mods,
            equipable=self.equipable,
            equip_slot=self.equip_slot,
            rarity=self.rarity,
            props=self.props,
        )

    def prep_db(self) -> dict:
        data = self.to_item().model_dump()
        del data["id"]
        del data["created_at"]
        return data
