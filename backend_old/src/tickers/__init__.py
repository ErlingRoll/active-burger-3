from .entity.regen_ticker import MonsterRegenTicker
from .erlyville_ticker import tickers as erlyville_tickers
from .mage_tower import tickers as mage_tower_tickers

spawn_tickers = [*erlyville_tickers, *mage_tower_tickers]
entity_tickers = [MonsterRegenTicker]

tickers = [*spawn_tickers, *entity_tickers]
