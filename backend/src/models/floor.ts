import { BaseSchema, FloorSchema } from "../database/types/schemas.js"
import { ClassProps } from "../utils/type-utils.js"
import { Tile } from "./tile.js"

export class Floor implements BaseSchema, FloorSchema {
    id: string
    created_at: string
    run_id: string
    number: number
    mods: Record<string, any>

    tiles: { [x_y: string]: Tile } = {}

    constructor(floor: ClassProps<Floor>) {
        this.id = floor.id
        this.created_at = floor.created_at
        this.run_id = floor.run_id
        this.number = floor.number
        this.mods = floor.mods
        this.tiles = floor.tiles
    }

    getTile(x: number, y: number): Tile | null {
        return this.tiles[`${x}_${y}`] || null
    }
}
