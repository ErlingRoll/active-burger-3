import { TileSchema } from "../database/types/schemas.js"
import { TileType } from "../database/types/tiles.js"

export class Tile implements TileSchema {
    id!: string
    created_at!: string
    run_id!: string
    floor_id!: string
    x!: number
    y!: number
    type!: string
    hidden!: boolean
    tile_type!: TileType

    private constructor(schema: TileSchema) {
        this.id = schema.id
        this.created_at = schema.created_at
        this.run_id = schema.run_id
        this.floor_id = schema.floor_id
        this.x = schema.x
        this.y = schema.y
        this.type = schema.type
        this.hidden = schema.hidden
        this.tile_type = schema.tile_type
    }
}
