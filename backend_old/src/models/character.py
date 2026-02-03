from math import floor
from pydantic import ConfigDict
from typing import Any, Dict, Optional
from src.models.damage_hit import DamageHit, HitResult
from src.generators.world import Realm
from src.models import Entity, Item


class Character(Entity):
    account_id: str
    type: str = "character"
    direction: str = "right"
    gold: int = 100
    name_visible: bool = True
    solid: bool = False
    max_hp: int = 100
    current_hp: int = 100
    max_exp: int = 100
    current_exp: int = 0
    realm: Realm = Realm.BOB_VALLEY
    props: Dict = {}

    model_config = ConfigDict(extra="allow")

    def to_character(self):
        # Only DB model fields
        return Character(
            id=self.id,
            created_at=self.created_at,
            account_id=self.account_id,
            name=self.name,
            x=self.x,
            y=self.y,
            level=self.level,
            max_hp=self.max_hp,
            current_hp=self.current_hp,
            max_exp=self.max_exp,
            current_exp=self.current_exp,
            regen=self.regen,
            direction=self.direction,
            name_visible=self.name_visible,
            solid=self.solid,
            texture=self.texture,
            type=self.type,
            object_id=self.object_id,
            gold=self.gold,
            realm=self.realm,
            props=self.props,
        )

    def db_prep(self) -> dict:
        data = self.to_character().model_dump()
        del data["id"]
        del data["created_at"]
        del data["height"]
        del data["width"]
        del data["db_type"]
        return data


class CharacterData(Character):
    items: Dict[str, Item] = {}
    equipment: Dict[str, Optional[Item]] = {}

    def _ready_character_stats(self, character_data: "CharacterData") -> "CharacterData":
        if not character_data.props:
            character_data.props = {}
        if character_data.props.get("stats", None) is None:
            character_data.props["stats"] = {}
        return character_data

    def equip_item(self, item: Item) -> "CharacterData":
        self._ready_character_stats(self)
        if not item.equip_slot:
            raise ValueError("[_equip_item] Item is not equipable")
        self.equipment[item.equip_slot] = item

        item_mods = item.get_all_mods()
        for mod_id, value in item_mods.items():
            current_value = self.props["stats"].get(mod_id, 0)
            new_value = current_value + value
            self.props["stats"][mod_id] = new_value

        return self.parse_stats()

    def unequip_item(self, item: Item) -> "CharacterData":
        self._ready_character_stats(self)
        if not item.equip_slot:
            raise ValueError("[_unequip_item] Item is not equipable")
        self.equipment[item.equip_slot] = None

        item_mods = item.get_all_mods()
        for mod_id, value in item_mods.items():
            current_value = self.props["stats"].get(mod_id, 0)
            new_value = current_value - value
            self.props["stats"][mod_id] = new_value

        return self.parse_stats()

    def default_max_hp(self) -> int:
        # TODO: Calculate base max HP from level, class, etc.
        return 100

    def parse_stats(self) -> "CharacterData":
        stats: Dict[str, Any] = self.props.get("stats", {})
        self.max_hp = floor((self.default_max_hp() + stats.get("max_hp", 0))
                            * ((100 + stats.get("increased_hp", 0)) / 100))
        if self.current_hp > self.max_hp:
            self.current_hp = self.max_hp
        return self

    def to_character(self) -> Character:
        data = self.model_dump()
        data.pop("items", None)
        data.pop("equipment", None)
        return Character(**data)
