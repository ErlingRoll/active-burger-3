import { RunOption, Tile } from "../game/objects"
import { UserAction } from "./server-types"

class GameActions {
    user = null
    gameCon: WebSocket = null
    parentContext: any = null
    reconnect: () => void = null

    constructor(reconnect: () => void) {
        this.reconnect = reconnect
    }

    ready(action: any) {
        const hasIdentity = Boolean(this.user)
        action.userId = this.user.id
        const ready = Boolean(hasIdentity && this.gameCon && this.gameCon.readyState === WebSocket.OPEN)
        if (!ready) {
            console.error("GameActions not ready: " + action.action || "unknown", {
                hasIdentity,
                gameCon: this.gameCon,
                readyState: this.gameCon ? this.gameCon.readyState : "no connection",
            })
            this.reconnect()
        }
        return ready
    }

    send(action: any) {
        if (!this.ready(action)) return
        this.gameCon.send(JSON.stringify(action))
    }

    startRun() {
        const action = {
            action: UserAction.START_RUN,
            payload: {},
        }
        this.send(action)
    }

    endRun() {
        const action = {
            action: UserAction.END_RUN,
            payload: {},
        }
        this.send(action)
    }

    activateTile(tile: Tile) {
        const action = {
            action: UserAction.ACTIVATE_TILE,
            payload: { tile },
        }
        this.send(action)
    }

    selectRunOption(payload: { tile_id: string; option: RunOption }) {
        const action = {
            action: UserAction.SELECT_RUN_OPTION,
            payload,
        }
        this.send(action)
    }

    useItem(itemId: string) {
        const action = {
            action: UserAction.USE_ITEM,
            payload: { item_id: itemId },
        }
        this.send(action)
    }
}

export default GameActions
