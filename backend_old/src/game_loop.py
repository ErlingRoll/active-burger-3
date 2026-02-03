
from asyncio import gather, get_event_loop, sleep

from src.gamestate import Gamestate
from src.tickers import tickers


TICK_RATE = 1.0  # seconds


async def game_tick(tickers):
    tick_tasks = [ticker.game_tick() for ticker in tickers]
    await gather(*tick_tasks)


async def game_loop(app, database, connection_manager, gamestate: Gamestate):
    ticker_registry = []

    for ticker_cls in tickers:
        ticker = ticker_cls(database=database, connection_manager=connection_manager, gamestate=gamestate)
        ticker_registry.append(ticker)

    while True:
        start_time = get_event_loop().time()

        await game_tick(ticker_registry)

        await gamestate.publish_gamestate()

        elapsed = get_event_loop().time() - start_time
        await sleep(max(0, TICK_RATE - elapsed))
