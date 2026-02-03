from typing import List, Optional
from pydantic import BaseModel
from random import randint
from src.generators.dice import roll, roll_chance
from src.generators.item import generate_item
from src.models.item import Item, Rarity


class LootTableItem(BaseModel):
    item_id: str
    chance: float  # 0.0 to 1.0
    amount: int  # Always drop this amount
    random_amount: Optional[int] = 0  # Additionally drop up to this amount


class LootTable(BaseModel):
    items: List[LootTableItem]

    def roll_loot(self, luck=0, fortune=0) -> List[Item]:
        dropped_items = []
        for item in self.items:
            loot_chance_roll = roll_chance(luck=luck)
            if loot_chance_roll <= item.chance:
                new_item = generate_item(item_id=item.item_id, count=item.amount)

                if new_item.count is None:
                    new_item.count = 1

                if not new_item.rarity in [Rarity.EPIC, Rarity.LEGENDARY, Rarity.ARTIFACT]:
                    new_item.count = new_item.count * (1 + fortune)

                random_amount = randint(0, item.random_amount if item.random_amount else 0)
                new_item.count += random_amount

                dropped_items.append(new_item)

        return dropped_items


class Lootable(BaseModel):
    loot_table: LootTable

    def roll_loot(self, luck=0, fortune=0) -> List[Item]:
        raise NotImplementedError("roll_loot must be implemented by subclasses")
