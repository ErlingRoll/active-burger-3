import { TileDao } from "../database/tile-dao.js"
import { BaseSchema, TileSchema } from "../database/types/schemas.js"
import { TileType } from "../database/types/tiles.js"
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

    constructor(model: BaseSchema & TileSchema & { tile_object: TileObject | null }) {
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
    }

    async sync(): Promise<void> {
        await TileDao.updateTile(this)
    }

    static async loadById(id: string): Promise<Tile> {
        const tile = await TileDao.getTileById(id)
        if (!tile) {
            throw new Error(`Tile with ID ${id} not found.`)
        }
        return new Tile(tile)
    }

    static createFromSchema(schema: TileSchema): Tile {
        return new Tile(schema as Tile)
    }

    async reveal(): Promise<void> {
        this.hidden = false
        await this.sync()
    }

    async activate({ user, activeRun }: { user: User; activeRun: Run }): Promise<void> {
        const tileObject = this.tile_object
        if (!tileObject) {
            console.warn(`Tile at (${this.x}, ${this.y}) has no tile object to activate.`)
            return
        }
        tileObject.activate({ user, activeRun })
    }
}
