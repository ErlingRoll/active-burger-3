import os
from dotenv import load_dotenv
from supabase import acreate_client, AsyncClient


load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


async def create_database_client() -> AsyncClient:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables.")
    print(f"Initializing database connection...")
    supabase_client = await acreate_client(SUPABASE_URL, SUPABASE_KEY)
    print(f"Database connection initialized.")
    return supabase_client
