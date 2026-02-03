from ast import Dict
import json
from typing import Any, Optional
from pydantic import BaseModel, ConfigDict

from src.generators.world import Realm


class RenderObject(BaseModel):
    # Characters, Objects, NPCs, etc.

    id: str = ""
    created_at: Optional[str] = None
    type: Optional[str] = "object"
    name: str
    name_visible: bool = True
    x: int = 0
    y: int = 0
    realm: Realm
    texture: Optional[str] = None
    height: Optional[int] = None  # in pixels
    width: Optional[int] = None  # in pixels
    solid: bool = False
    object_id: Optional[str] = None
    props: dict[str, Any] = {}
    model_config = ConfigDict(extra="allow", use_enum_values=True, arbitrary_types_allowed=True)

    # Non-DB fields
    db_type: str = "object"

    def to_dict(self):
        return {**self.__dict__, **self.model_extra}

    def to_json_string(self):
        return json.dumps(self.to_dict())

    def to_db_model(self) -> "RenderObject":
        return RenderObject.model_construct(**self.model_dump(exclude={"db_type"}))

    def prep_db(self) -> dict:
        data = self.to_db_model().model_dump()
        remove_keys = ["id", "created_at", "db_type", "expDrop", "loot_table", "chance",
                       "amount",
                       "random_amount", "power", "target_x", "target_y", "target_realm"]
        for key in remove_keys:
            data.pop(key, None)
        return data
