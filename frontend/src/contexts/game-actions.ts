import { RunOption, Tile } from "../game/objects"
import { UserAction } from "./server-types"

class GameActions {
    ACTION_COOLDOWN_MS = 100

    user = null
    gameCon: WebSocket = null
    parentContext: any = null
    reconnect: () => void = null
    lastAction = new Date().getTime()

    constructor(reconnect: () => void) {
        this.reconnect = reconnect
    }

    ready(action: any) {
        const now = new Date().getTime()
        if (now - this.lastAction < this.ACTION_COOLDOWN_MS) {
            console.error("Action cooldown: " + action.action || "unknown", {
                lastAction: this.lastAction,
                now,
                cooldown: this.ACTION_COOLDOWN_MS,
            })
            return false
        }
        this.lastAction = now

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

    send(action: any): boolean {
        if (!this.ready(action)) return false
        console.debug("Sending action:", action)
        this.gameCon.send(JSON.stringify(action))
        return true
    }

    startRun(): boolean {
        const action = {
            action: UserAction.START_RUN,
            payload: {},
        }
        return this.send(action)
    }

    endRun(): boolean {
        const action = {
            action: UserAction.END_RUN,
            payload: {},
        }
        return this.send(action)
    }

    activateTile(payload: { tile: Tile; floor_number: number }): boolean {
        const action = {
            action: UserAction.ACTIVATE_TILE,
            payload,
        }
        return this.send(action)
    }

    selectRunOption(payload: { tile_id: string; option: RunOption }): boolean {
        const action = {
            action: UserAction.SELECT_RUN_OPTION,
            payload,
        }
        return this.send(action)
    }

    useItem(itemId: string): boolean {
        const action = {
            action: UserAction.USE_ITEM,
            payload: { item_id: itemId },
        }
        return this.send(action)
    }
}

export default GameActions
