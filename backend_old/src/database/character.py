from asyncio import gather
from supabase import AsyncClient

from src.database.item import get_items_by_character_id
from src.database.equipment import get_equipment_by_character_id
from src.models import Character, CharacterData, Item, EquipmentSlot


async def update_character(database: AsyncClient, character: Character) -> Character | None:
    data = character.db_prep()
    response = await database.table("character").update(data).eq("id", character.id).execute()
    return CharacterData(**response.data[0]) if response.data else None


async def update_character_pos(database: AsyncClient, character_id: str, x: int, y: int, direction: str) -> Character | None:
    data = {"x": x, "y": y, "direction": direction}
    response = await database.table("character").update(data).eq("id", character_id).execute()
    return Character(**response.data[0]) if response.data else None


async def update_character_hp(database: AsyncClient, character_id: str, current_hp: int) -> Character | None:
    data = {"current_hp": current_hp}
    response = await database.table("character").update(data).eq("id", character_id).execute()
    return Character(**response.data[0]) if response.data else None


async def create_character(database: AsyncClient, character: Character):
    data = character.db_prep()
    response = await database.table("character").insert(data).execute()
    return Character(**response.data[0]) if response.data else None


async def get_character_by_id(database: AsyncClient, character_id: str) -> Character | None:
    response = await database.table("character").select("*").eq("id", character_id).execute()
    return Character(**response.data[0]) if response.data else None


async def get_character_by_account_id(database: AsyncClient, account_id: str):
    response = await database.table("character").select("*").eq("account_id", account_id).execute()
    return Character(**response.data[0]) if response.data else None


async def get_character_data_by_id(database: AsyncClient, character_id: str) -> CharacterData | None:
    """ Fetches all data related to a character, including items and stats. """

    character_promise = get_character_by_id(database, character_id)
    items_promise = get_items_by_character_id(database, character_id)
    equipment_promise = get_equipment_by_character_id(database, character_id)

    character, items, equipment = await gather(character_promise, items_promise, equipment_promise)

    if not character:
        return None

    item_map = {item.id: item for item in items}
    equipment_map = {equip.slot: equip.item for equip in equipment}

    character_data = CharacterData(**character.model_dump())
    character_data.items = item_map
    character_data.equipment = equipment_map

    return character_data


async def get_characters(database: AsyncClient) -> dict[str, Character]:
    data = await database.table("character").select("*").execute()
    if data and data.data:
        characters = {char["id"]: Character(**char) for char in data.data}
        return characters
    return {}
