from typing import Awaitable, List, cast
from postgrest import APIResponse
from supabase import AsyncClient

from src.generators.item import generate_item
from src.models import Item


async def get_item_by_id(database: AsyncClient, id: str) -> Item | None:
    response = await database.table("item").select("*").eq("id", id).execute()
    return generate_item(**response.data[0]) if response.data else None


async def create_item(database: AsyncClient, item: Item) -> Item | None:
    data = item.prep_db()
    response = await database.table("item").insert(data).execute()
    return generate_item(**response.data[0]) if response.data else None


async def update_item(database: AsyncClient, item: Item) -> Item | None:
    item_id = item.id
    data = item.prep_db()
    response = await database.table("item").update(data).eq("id", item_id).execute()
    return generate_item(**response.data[0]) if response.data else None


async def delete_item(database: AsyncClient, item_id: str) -> bool:
    await database.table("item").delete().eq("id", item_id).execute()
    return True


async def raw_get_items_by_character_id(database: AsyncClient, character_id: str) -> APIResponse:
    return await cast(Awaitable[APIResponse], database.table("item").select("*").eq("character_id", character_id).execute())


async def get_items_by_character_id(database: AsyncClient, character_id: str) -> List[Item]:
    response: APIResponse = await raw_get_items_by_character_id(database, character_id)
    items = response.data if response.data else []
    return [generate_item(**item) for item in items]
