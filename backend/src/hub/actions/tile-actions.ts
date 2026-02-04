import { TileSchema } from "../../database/types/schemas.js"
import { TileType } from "../../database/types/tiles.js"
import { hub } from "../../index.js"
import { Run } from "../../models/run.js"
import { Tile } from "../../models/tile.js"
import { User } from "../../models/user.js"
import { GameEvent } from "../types.js"

export interface ActiveTilePayload {
    tile: TileSchema
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
        const tile = await Tile.loadById(payload.tile.id)

        if (tile.hidden) {
            await tile.reveal()
            hub.sendTo(clientId, {
                event: GameEvent.TILE_UPDATED,
                payload: {
                    tile: tile,
                },
            })
            return
        }

        const activeRun = await Run.loadActiveByUserId(user.id)
        if (!activeRun) {
            hub.sendUserError(clientId, `No active run found.`)
            return
        }

        switch (tile.tile_type) {
            case TileType.EMPTY:
                break
            case TileType.LOADING:
                break
            case TileType.EXIT:
                await activeRun.exitFloor()
                hub.sendTo(clientId, {
                    event: GameEvent.RUN_UPDATED,
                    payload: {
                        run: activeRun,
                    },
                })
                break
            default:
                throw new Error(`Unhandled tile type: ${tile.tile_type}`)
        }
    }
}
