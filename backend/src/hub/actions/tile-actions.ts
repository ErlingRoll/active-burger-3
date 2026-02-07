import { TileSchema } from "../../database/types/schemas.js"
import { TileType } from "../../database/types/tiles.js"
import { hub } from "../../index.js"
import { Run } from "../../models/run.js"
import { Tile } from "../../models/tile.js"
import { User } from "../../models/user.js"
import { GameEvent } from "../types.js"

export interface ActiveTilePayload {
    tile: Tile
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
        if (!payload.tile || !payload.tile.id) return
        const tile = await Tile.loadById(payload.tile.id)

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

        const activeRun = await Run.loadActiveByUserId(user.id)
        if (!activeRun) {
            hub.sendClientError(clientId, `No active run found.`)
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
