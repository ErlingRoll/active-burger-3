import { BaseSchema, FloorSchema } from "../database/types/schemas.js"
import { Tile } from "./tile.js"

export class Floor implements BaseSchema, FloorSchema {
    id: string
    created_at: string
    run_id: string
    number: number
    mods: Record<string, any>

    tiles: { [x_y: string]: Tile } = {}

    private constructor(schema: Floor) {
        this.id = schema.id
        this.created_at = schema.created_at
        this.run_id = schema.run_id
        this.number = schema.number
        this.mods = schema.mods
    }

    static createFromSchema(schema: FloorSchema): Floor {
        return new Floor(schema as Floor)
    }
}
