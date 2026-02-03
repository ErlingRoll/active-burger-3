from supabase import AsyncClient

from src.models.account import Account


async def create_account(database: AsyncClient, account: Account) -> Account | None:
    account_json = account.model_dump()
    if account_json.get("id"):
        del account_json["id"]
    if account_json.get("created_at"):
        del account_json["created_at"]
    response = await database.table("account").insert(account_json).execute()
    return Account(**response.data[0]) if response.data else None


async def get_account_by_discord_id(database: AsyncClient, discord_id: str) -> Account | None:
    response = await database.table("account").select("*").eq("discord_id", discord_id).execute()
    return Account(**response.data[0]) if response.data else None
