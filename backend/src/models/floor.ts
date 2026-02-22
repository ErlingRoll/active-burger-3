import { BaseSchema, FloorSchema } from "../database/types/schemas.js"
import { ClassProps } from "../utils/type-utils.js"
import { TileObjectType } from "./constants.js"
import { Monster } from "./monster.js"
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

    getActiveMonsters(): Monster[] {
        return Object.values(this.tiles)
            .filter(
                (tile) =>
                    !tile.hidden && tile.tile_object && tile.tile_object.tile_object_type === TileObjectType.MONSTER
            )
            .map((tile) => tile.tile_object as Monster)
    }
}
