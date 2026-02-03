from typing import Literal
from src.generators.world import Realm
from src.spawners.spawner import SpawnTable, SpawnTableItem, Spawner


class NoobmineEntry(Spawner):
    start_x: int = 6
    start_y: int = -10
    end_x: int = 21
    end_y: int = 1
    realm: Realm = Realm.ERLYVILLE
    safe_radius: int = 1
    spawn_table: SpawnTable = SpawnTable(items=[
        SpawnTableItem(object_id="gold_ore", chance=0.5),
    ])


class NoobmineMonsters(Spawner):
    start_x: int = -5
    start_y: int = -17
    end_x: int = 1
    end_y: int = -5
    realm: Realm = Realm.ERLYVILLE
    object_type: Literal["object", "monster"] = "monster"
    safe_radius: int = 2
    spawn_table: SpawnTable = SpawnTable(items=[
        SpawnTableItem(object_id="karate_panda", chance=0.7),
    ])


class NoobmineCenterMonsters(Spawner):
    start_x: int = 3
    start_y: int = -29
    end_x: int = 16
    end_y: int = -13
    realm: Realm = Realm.ERLYVILLE
    object_type: Literal["object", "monster"] = "monster"
    safe_radius: int = 2
    spawn_table: SpawnTable = SpawnTable(items=[
        SpawnTableItem(object_id="vampire", chance=0.8),
    ])
