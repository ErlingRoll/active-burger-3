from typing import Dict
from postgrest import APIError, APIResponse
from supabase import AsyncClient

from src.models import Terrain


async def db_get_terrain(database: AsyncClient) -> Dict[str, Terrain]:
    response: APIResponse = await database.table("terrain").select("*").execute()
    if not response.data:
        return {}

    terrain = {}
    for item in response.data:
        _terrain = Terrain(**item)
        terrain[_terrain.id] = _terrain

    return terrain


async def db_create_terrain(database: AsyncClient, terrain: Terrain) -> Terrain | None:
    data = terrain.prep_db()
    try:
        response = await database.table("terrain").insert(data).execute()
    except APIError as e:
        print(f"Error inserting terrain: {e}")
        return None
    return Terrain(**response.data[0]) if response.data else None


async def db_delete_terrain(database: AsyncClient, terrain_id: str):
    await database.table("terrain").delete().eq("id", terrain_id).execute()
