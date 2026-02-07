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
    tile_object_id: string | null

    tile_object: TileObject | null

    private constructor(schema: Tile) {
        this.id = schema.id
        this.created_at = schema.created_at
        this.run_id = schema.run_id
        this.floor_id = schema.floor_id
        this.x = schema.x
        this.y = schema.y
        this.type = schema.type
        this.hidden = schema.hidden
        this.tile_type = schema.tile_type
        this.tile_object_id = schema.tile_object_id
        this.tile_object = schema.tile_object
    }

    async sync(): Promise<void> {
        await TileDao.updateTile(this)
    }

    static async loadById(id: string): Promise<Tile> {
        const tile = await TileDao.getTileById(id)
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
