import { Rarity } from "../constants.js"
import { Run } from "../run.js"
import { Tile } from "../tile.js"
import { User } from "../user.js"

export enum RunOptionType {
    LOOT = "loot",
}

export class RunOption {
    title: string | null
    texture: string | null
    description: string | null
    rarity: Rarity
    type: RunOptionType

    constructor(option: {
        title: string | null
        texture: string | null
        description: string | null
        rarity: Rarity
        type: RunOptionType
    }) {
        this.title = option.title || null
        this.texture = option.texture || null
        this.description = option.description || null
        this.rarity = option.rarity || Rarity.COMMON
        this.type = option.type
    }

    async select?({ user, run, tile }: { user: User; run: Run; tile: Tile }): Promise<void> {
        console.error(`RunOption select() not implemented for type ${this.type}`)
    }
}
