from asyncio import create_task, gather
from typing import List
from aiohttp.web import Request, WebSocketResponse
from src.database.character import get_character_data_by_id, update_character_hp
from src.models.items.mods import WeaponMod
from src.generators.monster import generate_monster
from src.models.damage_hit import DamageHit, DamageHitEvent, DamageHitEventPayload, HitResult
from src.models.items.weapon import Weapon
from src.models.objects.monster.monster import Monster
from src.database.equipment import get_equipment_item
from src.database.object import db_delete_object
from src.actions.give_loot import GiveLootPayload, give_loot
from src.connection_manager import ConnectionManager, GameEvent
from src.gamestate import Gamestate
from src.models import Account, Character, RenderObject, Item, EquipSlot


async def monster_interact(request: Request, ws: WebSocketResponse, account: Account, character: Character, object: RenderObject):
    database = request.app['database']
    connection_manager: ConnectionManager = request.app['connection_manager']
    gamestate: Gamestate = request.app['gamestate']

    if character.id is None:
        event = GameEvent(
            event="log",
            payload={"error": "Missing character ID"},
        )
        return await ws.send_json(event.model_dump())

    weapon = await get_equipment_item(database, character.id, EquipSlot.WEAPON)  # type: ignore

    if weapon is None:
        event = GameEvent(
            event="log",
            payload={"error": "No weapon equipped"},
            log=["You need to equip a weapon to attack monsters"],
        )
        return await ws.send_json(event.model_dump())

    weapon: Weapon = Weapon(**weapon.model_dump())

    monster_defaults = object.to_dict()
    del monster_defaults['object_id']
    monster: Monster = generate_monster(object_id=object.object_id, **monster_defaults)  # type: ignore

    hit: DamageHit = weapon.roll_hit()
    hit_result: HitResult = monster.damage(hit)

    monster_hit_event = DamageHitEvent(
        payload=DamageHitEventPayload(
            source_id=character.id or "unknown",
            target_id=monster.id or "unknown",
            hit=hit_result
        )
    )
    create_task(connection_manager.broadcast(monster_hit_event))

    await gamestate.update_object(monster)

    if monster.is_alive():
        character_data = await get_character_data_by_id(database, character.id)
        if character_data is None:
            raise ValueError("[monster_interact] Character not found in database")

        monster_hit = monster.roll_hit()
        hit_result = character_data.damage(monster_hit)
        character_hit_event = DamageHitEvent(
            payload=DamageHitEventPayload(
                source_id=monster.id or "unknown",
                target_id=character.id or "unknown",
                hit=hit_result
            )
        )
        create_task(connection_manager.broadcast(character_hit_event))
        create_task(gamestate.publish_character(account.id, character_data=character_data))
        create_task(update_character_hp(database, character.id, character_data.current_hp))

        # Todo if character dies, handle respawn
        return

    if monster.id is None:
        raise ValueError("Monster must have an id to be deleted from the database and gamestate")

    gather(db_delete_object(database, monster.id), gamestate.delete_object(monster.id))

    loot: List[Item] = monster.roll_loot(fortune=weapon.get_mod_value(WeaponMod.FORTUNE.value))

    log_message = f"You defeated {monster.name} and received: "
    for item in loot:
        log_message += f"{item.name} x{item.count}, "

    if len(loot) == 0:
        log_message += "Nothing"

    log_message = log_message.rstrip(", ")

    loot_payload = GiveLootPayload(items=loot, log=[log_message])

    create_task(give_loot(request, ws, account, character, loot_payload.model_dump()))

    event = GameEvent(
        event="log",
        payload={},
        log=[log_message]
    )
    return create_task(ws.send_json(event.model_dump()))
