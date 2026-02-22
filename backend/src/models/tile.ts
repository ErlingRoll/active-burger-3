import { TileDao } from "../database/tile-dao.js"
import { BaseSchema, TileSchema } from "../database/types/schemas.js"
import { TileType } from "../database/types/tiles.js"
import { gamesync } from "../index.js"
import { ClassProps } from "../utils/type-utils.js"
import { TileObjectType } from "./constants.js"
import { Floor } from "./floor.js"
import { Run } from "./run.js"
import { TileObject } from "./tile-object.js"
import { User } from "./user.js"

export class Tile implements BaseSchema, TileSchema {
    id: string
    created_at: string
    run_id: string
    floor_id: string
    x: number
    y: number
    type: string
    hidden: boolean
    tile_type: TileType

    tile_object: TileObject | null
    floor: Floor

    constructor(model: ClassProps<Tile>) {
        this.id = model.id
        this.created_at = model.created_at
        this.run_id = model.run_id
        this.floor_id = model.floor_id
        this.x = model.x
        this.y = model.y
        this.type = model.type
        this.hidden = model.hidden
        this.tile_type = model.tile_type
        this.tile_object = model.tile_object
        this.floor = model.floor
    }

    async sync(): Promise<void> {
        const { tile_object, floor, ...updateData } = this
        await TileDao.updateTile(updateData)
    }

    async deleteTileObject(): Promise<void> {
        if (!this.tile_object) return
        this.tile_object = null
        this.tile_type = TileType.EMPTY
        gamesync.markDirty(this)
    }

    async reveal(): Promise<void> {
        this.hidden = false
        gamesync.markDirty(this)
    }

    async activate({ user, activeRun }: { user: User; activeRun: Run }): Promise<void> {
        const tileObject = this.tile_object
        if (!tileObject) {
            return
        }
        tileObject.activate({ user, activeRun })
    }
}
