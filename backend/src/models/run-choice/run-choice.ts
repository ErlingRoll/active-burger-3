import { LootRunOption } from "./options/loot-option.js"
import { RunOption, RunOptionType } from "./run-option.js"

export interface RunChoiceInterface {
    tile_id: string | null
    options: RunOption[]
}

export class RunChoice implements RunChoiceInterface {
    tile_id: string | null
    options: RunOption[]

    constructor(tile_id: string | null, options: RunOption[]) {
        this.tile_id = tile_id
        this.options = options.map((option) => {
            switch (option.type) {
                case RunOptionType.LOOT:
                    return new LootRunOption(option as LootRunOption)
                default:
                    return new RunOption(option)
            }
        })
    }
}
