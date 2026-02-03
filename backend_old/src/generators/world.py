
from enum import Enum


class Realm(str, Enum):
    # Mage Dimension
    PORTAL_HUB = "portal_hub"
    MAGE_TOWER = "mage_tower"

    # Erlyville
    ERLYVILLE = "erlyville"

    # Bob Valley
    BOB_VALLEY = "bob_valley"
    BOB_EAST_FOREST = "bob_east_forest"
    BOB_JUNGLE_PASSAGE = "bob_jungle_passage"
    BOB_CAVE_ENTRANCE = "bob_cave_entrance"
    BOB_DLC_ISLAND = "bob_dlc_island"
    BOB_VALLEY_LEFT = "bob_valley_left"
    BOB_VALLEY_RIGHT = "bob_valley_right"
