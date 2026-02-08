import { RunOption, Tile } from "../game/objects"
import { Realm } from "../game/world"

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
            action: "start_run",
            payload: {},
        }
        this.send(action)
    }

    endRun() {
        const action = {
            action: "end_run",
            payload: {},
        }
        this.send(action)
    }

    activateTile(tile: Tile) {
        const action = {
            action: "activate_tile",
            payload: { tile },
        }
        this.send(action)
    }

    selectRunOption(payload: { tile_id: string; option: RunOption }) {
        const action = {
            action: "select_run_option",
            payload,
        }
        this.send(action)
    }

    // getCharacter({ character_id }: { character_id: string }) {
    //     const action = {
    //         action: "get_character",
    //         payload: { character_id },
    //     }
    //     this.send(action)
    // }

    // move({ x, y, direction }: { x: number; y: number; direction: string }) {
    //     const action = {
    //         action: "move",
    //         payload: { x, y, direction },
    //     }
    //     this.send(action)
    // }

    // respawn() {
    //     const action = {
    //         action: "respawn",
    //         payload: {},
    //     }
    //     this.send(action)
    // }
}

export default GameActions
