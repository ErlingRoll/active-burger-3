from src.generators.world import Realm
from src.spawners.spawner import SpawnTable, SpawnTableItem, Spawner


class Room1(Spawner):
    start_x: int = -3
    start_y: int = 6
    end_x: int = 3
    end_y: int = 11
    realm: Realm = Realm.MAGE_TOWER
    safe_radius: int = 1
    spawn_table: SpawnTable = SpawnTable(items=[
        SpawnTableItem(object_id="vampire", chance=0.7),
    ])


class Guardian1(Spawner):
    start_x: int = 0
    start_y: int = 12
    end_x: int = 0
    end_y: int = 12
    realm: Realm = Realm.MAGE_TOWER
    safe_radius: int = 0
    spawn_table: SpawnTable = SpawnTable(items=[
        SpawnTableItem(object_id="guardian", chance=0.1),
    ])


class Room2(Spawner):
    start_x: int = -3
    start_y: int = 13
    end_x: int = 3
    end_y: int = 19
    realm: Realm = Realm.MAGE_TOWER
    safe_radius: int = 1
    spawn_table: SpawnTable = SpawnTable(items=[
        SpawnTableItem(object_id="demon", chance=0.7),
    ])


class Guardian2(Spawner):
    start_x: int = 0
    start_y: int = 20
    end_x: int = 0
    end_y: int = 20
    realm: Realm = Realm.MAGE_TOWER
    safe_radius: int = 0
    spawn_table: SpawnTable = SpawnTable(items=[
        SpawnTableItem(object_id="guardian", chance=0.1),
    ])


class Room3(Spawner):
    start_x: int = -3
    start_y: int = 21
    end_x: int = 3
    end_y: int = 27
    realm: Realm = Realm.MAGE_TOWER
    safe_radius: int = 1
    spawn_table: SpawnTable = SpawnTable(items=[
        SpawnTableItem(object_id="gargoyle", chance=0.7),
    ])


class Guardian3(Spawner):
    start_x: int = 0
    start_y: int = 28
    end_x: int = 0
    end_y: int = 28
    realm: Realm = Realm.MAGE_TOWER
    safe_radius: int = 0
    spawn_table: SpawnTable = SpawnTable(items=[
        SpawnTableItem(object_id="guardian", chance=0.1),
    ])


class Room4(Spawner):
    start_x: int = 0
    start_y: int = 32
    end_x: int = 0
    end_y: int = 32
    realm: Realm = Realm.MAGE_TOWER
    safe_radius: int = 0
    spawn_table: SpawnTable = SpawnTable(items=[
        SpawnTableItem(object_id="archmage", chance=0.06),
    ])
