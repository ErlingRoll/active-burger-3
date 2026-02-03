from typing import Awaitable, List, cast
from postgrest import APIResponse
from supabase import AsyncClient

from src.models import EquipmentSlot, Item, EquipSlot


async def upsert_equipment(database: AsyncClient, equipment: EquipmentSlot) -> EquipmentSlot:
    data = equipment.model_dump()
    equipment_id = data.pop("id", None)
    created_at = data.pop("created_at", None)
    item = data.pop("item", None)

    # Upsert equipment based on character_id and slot. On conflict, update the item_id.
    response = await database.table("equipment").upsert(
        data,
        on_conflict="character_id,slot",
    ).execute()

    if not response.data:
        raise ValueError(f"Failed to upsert equipment for character_id {equipment.character_id} in slot {equipment.slot}")

    return EquipmentSlot(**response.data[0])


async def raw_get_equipment_by_character_id(database: AsyncClient, character_id: str) -> APIResponse:
    query = database.table("equipment").select("*, item(*)").eq("character_id", character_id)
    return await cast(Awaitable[APIResponse], query.execute())


async def get_equipment_by_character_id(database: AsyncClient, character_id: str) -> List[EquipmentSlot]:
    response = await raw_get_equipment_by_character_id(database, character_id)

    if not response.data:
        return []

    return [EquipmentSlot(**item) for item in response.data]


async def get_equipment_item(database, character_id: str, slot: EquipSlot) -> Item | None:
    query = database.table("equipment").select("*, item(*)").eq("character_id", character_id).eq("slot", slot.value).limit(1)
    response: APIResponse = await cast(Awaitable[APIResponse], query.execute())

    if not response.data:
        return None

    equipment = EquipmentSlot(**response.data[0])

    return equipment.item
