import os
import asyncio
import aiohttp.web
from dotenv import load_dotenv

from src.game_loop import game_loop
from src.connection_manager import ConnectionManager
from src.init_database import create_database_client
from src.gamestate import Gamestate
from src.websocket import websocket_handler


load_dotenv()

PORT = int(os.getenv("PORT", 8080))


async def main():
    app = aiohttp.web.Application()

    # Init database
    database = await create_database_client()
    app["database"] = database

    # Connection manager
    connection_manager = ConnectionManager()
    app["connection_manager"] = connection_manager

    # Init gamestate
    gamestate = Gamestate(database=database, connection_manager=connection_manager)
    await gamestate.fetch_gamestate()
    app["gamestate"] = gamestate

    app.router.add_get('/game', websocket_handler)
    runner = aiohttp.web.AppRunner(app)
    await runner.setup()
    site = aiohttp.web.TCPSite(runner, '0.0.0.0', PORT)
    await site.start()
    print(f"Server started on http://0.0.0.0:{PORT}")

    await game_loop(app, database, connection_manager, gamestate)


if __name__ == "__main__":
    asyncio.run(main())
