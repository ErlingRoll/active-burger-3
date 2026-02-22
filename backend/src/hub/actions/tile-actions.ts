import { TileType } from "../../database/types/tiles.js"
import { gamestate, hub } from "../../index.js"
import { Tile } from "../../models/tile.js"
import { User } from "../../models/user.js"
import { GameEvent } from "../types.js"

export interface ActiveTilePayload {
    tile: Tile
    floor_number: number
}

export class TileActions {
    static async activateTile({
        clientId,
        user,
        payload,
    }: {
        clientId: string
        user: User
        payload: ActiveTilePayload
    }): Promise<void> {
        const activeRun = await gamestate.getActiveRunByUserId(user.id)
        if (!activeRun) {
            return hub.sendClientError(clientId, `No active run found.`)
        }

        const tile = await activeRun.getTile(payload.floor_number, payload.tile.x, payload.tile.y)
        if (!tile) {
            return hub.sendClientError(
                clientId,
                `Tile not found at (${payload.tile.x}, ${payload.tile.y}) on floor ${payload.floor_number}.`
            )
        }

        if (tile.hidden) {
            await tile.reveal()
            hub.sendToClient(clientId, {
                event: GameEvent.TILE_UPDATED,
                payload: {
                    tile: tile,
                },
            })
            return
        }

        switch (tile.tile_type) {
            case TileType.EMPTY:
                break
            case TileType.LOADING:
                break
            case TileType.OBJECT:
                tile.activate({ user, activeRun })
                break
            default:
                throw new Error(`Unhandled tile type: ${tile.tile_type}`)
        }
    }
}
