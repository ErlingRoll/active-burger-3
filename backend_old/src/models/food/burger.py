from __future__ import annotations
from typing import TYPE_CHECKING
from asyncio import create_task
from src.models import Character, UseResult
from .food import Food

if TYPE_CHECKING:
    from src.gamestate import Gamestate


class Burger(Food):
    item_id: str = "burger"
    name: str = "Burger"
    description: str = "Pretty decent BK burger. Greasy AF. Restores 20 HP."
    texture: str = "item/food/burger"
    value: int = 10

    async def use(self, character: Character | None = None, database=None, gamestate: Gamestate | None = None, *args, **kwargs) -> UseResult:
        from src.database.character import update_character

        if not character or not database or not gamestate:
            return UseResult(success=False, log=["Failed to eat burger: Server error"])

        if character.current_hp >= character.max_hp:
            return UseResult(success=False, log=["You are already at full health."])

        character.current_hp = min(character.max_hp, character.current_hp + 20)

        create_task(gamestate.publish_character(character.account_id, character.id))
        create_task(update_character(database, character))

        return UseResult(success=True, log=[f"The delicious burger restores 20 HP"])
