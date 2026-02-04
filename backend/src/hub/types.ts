import { User } from "../models/user.js"

export type ClientId = string // Websocket client identifier
export type UserId = string // Discord user identifier

export type HubState = {
    players: Map<UserId, User>
}

export enum GameEvent {
    LOGIN_SUCCESS = "login_success",
    LOG = "log",
    LOG_USER_ERROR = "log_user_error",
    LOG_SERVER_ERROR = "log_server_error",
    RUN_UPDATED = "run_updated",
    RUN_ENDED = "run_ended",
    TILE_UPDATED = "tile_updated",
}

export type ServerMessage = {
    event: GameEvent
    payload?: { [key: string]: any }
    log?: String[]
}

export enum UserAction {
    LOGIN = "login",
    START_RUN = "start_run",
    END_RUN = "end_run",
    ACTIVATE_TILE = "activate_tile",
}

export type ClientMessage = {
    userId: UserId
    action: UserAction
    payload?: { [key: string]: any }
}
