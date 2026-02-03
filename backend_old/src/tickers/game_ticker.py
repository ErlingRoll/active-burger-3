from abc import ABC, abstractmethod


class GameTickerInterface(ABC):
    @abstractmethod
    async def game_tick(self):
        pass
