from asyncio import gather
from supabase import AsyncClient

from src.generators.object import generate_object
from src.models.render_object import RenderObject


async def get_objects(database: AsyncClient) -> dict[str, RenderObject]:
    """ Fetch all objects and inherited objects from the database """

    objects = []

    task_1 = database.table("only_object").select("*").execute()
    task_2 = database.table("only_entity").select("*").execute()

    object_response, entity_response = await gather(task_1, task_2)

    objects += object_response.data if object_response and object_response.data else []
    objects += entity_response.data if entity_response and entity_response.data else []

    return {obj["id"]: generate_object(**obj) for obj in objects}


async def create_object(database: AsyncClient, object: RenderObject) -> RenderObject | None:
    db_type = object.db_type
    if db_type is None:
        raise ValueError("object.type is required to create an object in the database")

    data = object.prep_db()

    response = await database.table(db_type).insert(data).execute()

    if not response.data or len(response.data) == 0:
        return None

    return generate_object(**response.data[0])


async def db_delete_object(database: AsyncClient, object_id: str):
    response = await database.table("object").delete().eq("id", object_id).execute()
    return response.data[0] if response.data else None
