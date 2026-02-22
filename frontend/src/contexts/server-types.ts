export enum UserAction {
    LOGIN = "login",
    START_RUN = "start_run",
    END_RUN = "end_run",
    ACTIVATE_TILE = "activate_tile",
    SELECT_RUN_OPTION = "select_run_option",
    USE_ITEM = "use_item",
}

export enum GameEvent {
    LOGIN_SUCCESS = "login_success",
    ITEMS_UPDATED = "items_updated",
    RUN_UPDATED = "run_updated",
    RUN_STATS_UPDATED = "run_stats_updated",
    RUN_ENDED = "run_ended",
    TILE_UPDATED = "tile_updated",
    LOOT_DROPPED = "loot_dropped",
    RUN_CHOICE = "run_choice",
    CHARACTER_UPDATED = "character_updated",
    USER_UPDATED = "user_updated",
    MONSTER_DAMAGED = "monster_damaged",
    PARTY_DAMAGED = "party_damaged",

    // Logging events
    LOG = "log",
    LOG_USER_ERROR = "log_user_error",
    LOG_SERVER_ERROR = "log_server_error",
}
