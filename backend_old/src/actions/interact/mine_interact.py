from asyncio import gather
from typing import List
from aiohttp.web import Request, WebSocketResponse
from src.models.damage_hit import DamageHit
from src.models.items.mods import ToolMod
from src.models.items.tools import Tool
from src.database.equipment import get_equipment_item
from src.database.object import db_delete_object
from src.generators.object import generate_object
from src.actions.give_loot import GiveLootPayload, give_loot
from src.connection_manager import GameEvent
from src.gamestate import Gamestate
from src.models.objects.entity.ore.gold_ore import Ore
from src.models import Account, Character, RenderObject, Item, EquipSlot


async def mine_interact(request: Request, ws: WebSocketResponse, account: Account, character: Character, object: RenderObject):
    database = request.app['database']
    gamestate: Gamestate = request.app['gamestate']

    if character.id is None:
        event = GameEvent(
            event="log",
            payload={"error": "Missing character ID"},
        )
        return await ws.send_json(event.model_dump())

    pickaxe = await get_equipment_item(database, character.id, EquipSlot.PICKAXE)  # type: ignore

    if pickaxe is None:
        event = GameEvent(
            event="log",
            payload={"error": "No pickaxe equipped"},
            log=["You need to equip a pickaxe to mine ore"],
        )
        return await ws.send_json(event.model_dump())

    pickaxe: Tool = Tool(**pickaxe.model_dump())

    _ore_defaults = object.to_dict()
    del _ore_defaults['object_id']
    ore: Ore = generate_object(object_id=object.object_id, **_ore_defaults)  # type: ignore

    flat_efficiency = pickaxe.get_mod_value(ToolMod.EFFICIENCY.value)
    percent_efficiency = pickaxe.get_mod_value(ToolMod.INCREASED_EFFICIENCY.value) / 100
    total_efficiency = int(flat_efficiency * (1 + percent_efficiency))
    hit = DamageHit(physical=total_efficiency)
    ore.damage(hit)

    await gamestate.update_object(ore)

    if ore.is_alive():
        return

    if ore.id is None:
        raise ValueError("Ore object must have an id to be deleted from the database and gamestate")

    # Ore is mined
    gather(db_delete_object(database, ore.id), gamestate.delete_object(ore.id))

    loot: List[Item] = ore.roll_loot(
        luck=pickaxe.get_mod_value(ToolMod.LUCK.value),
        fortune=pickaxe.get_mod_value(ToolMod.FORTUNE.value)
    )

    log_message = f"You mined {ore.name} and received: "
    for item in loot:
        log_message += f"{item.name} x{item.count}, "
    log_message = log_message.rstrip(", ")

    loot_payload = GiveLootPayload(items=loot, log=[log_message])

    await give_loot(request, ws, account, character, loot_payload.model_dump())

    event = GameEvent(
        event="log",
        payload={},
        log=[log_message]
    )
    await ws.send_str(event.model_dump_json())
