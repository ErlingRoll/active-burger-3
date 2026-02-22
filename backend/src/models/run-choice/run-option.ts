import { Rarity, RunOptionType } from "../constants.js"
import { Run } from "../run.js"
import { Tile } from "../tile.js"
import { User } from "../user.js"

export class RunOption {
    title: string | null
    texture: string | null
    description: string | null
    rarity: Rarity
    type: RunOptionType
    floor_number: number
    tile_x: number
    tile_y: number
    tile: Tile

    constructor(option: {
        title: string | null
        texture: string | null
        description: string | null
        rarity: Rarity
        type: RunOptionType
        floor_number: number
        tile_x: number
        tile_y: number
        tile: Tile
    }) {
        this.title = option.title || null
        this.texture = option.texture || null
        this.description = option.description || null
        this.rarity = option.rarity || Rarity.COMMON
        this.type = option.type
        this.floor_number = option.floor_number
        this.tile_x = option.tile_x
        this.tile_y = option.tile_y
        this.tile = option.tile
    }

    async select?({ user, run, tile }: { user: User; run: Run; tile: Tile }): Promise<void> {
        console.error(`RunOption select() not implemented for type ${this.type}`)
    }
}
