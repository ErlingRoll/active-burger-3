import { Dice } from "../game/dice.js"
import { GameEvent } from "../hub/types.js"
import { hub } from "../index.js"
import { LootRunOption, LootType } from "./run-choice/options/loot-option.js"
import { RunChoice } from "./run-choice/run-choice.js"
import { RunOptionType } from "./run-choice/run-option.js"
import { Run } from "./run.js"
import { TileObject } from "./tile-object.js"
import { User } from "./user.js"

export class Chest extends TileObject {
    static DEFAULT_CHOICE_COUNT = 3
    static OPTION_TYPE_TABLE = {
        [RunOptionType.LOOT]: 1,
    }
    static LOOT_TYPE_TABLE = { [LootType.GOLD]: 10, [LootType.ESSENCE]: 1 }
    static MAX_GOLD_LOOT = 100
    static MAX_ESSENCE_LOOT = 10

    constructor(chest: any) {
        super(chest)
    }

    static fromModel(chest: Chest): Chest {
        return new Chest(chest)
    }

    async activate({ user, activeRun }: { user: User; activeRun: Run }): Promise<void> {
        const runChoice = new RunChoice(
            this.tile_id,
            Array.from({ length: Chest.DEFAULT_CHOICE_COUNT }, () => {
                // const lootOptionType = Dice.pickWeighted({table: Chest.OPTION_TYPE_TABLE, defaultValue: RunOptionType.LOOT})
                const option = this.generateLootOption()
                return option
            })
        )

        hub.sendToUser(user.id, {
            event: GameEvent.RUN_CHOICE,
            payload: {
                runChoice,
            },
        })
    }

    generateLootOption(): LootRunOption {
        const lootType = Dice.pickWeighted({ table: Chest.LOOT_TYPE_TABLE, defaultValue: LootType.GOLD })

        let option = null
        switch (lootType) {
            case LootType.GOLD:
                option = new LootRunOption({
                    title: "Gold",
                    description: "MONEY!",
                    rarity: this.rarity,
                    type: RunOptionType.LOOT,
                    loot_type: LootType.GOLD,
                    texture: "misc/gold",
                    count: 10,
                })
                break
            case LootType.ESSENCE:
                option = new LootRunOption({
                    title: "Essence",
                    description: "Floating magical energy???",
                    rarity: this.rarity,
                    type: RunOptionType.LOOT,
                    loot_type: LootType.ESSENCE,
                    texture: "misc/essence",
                    count: 1,
                })
                break
            default:
                console.error(`Unsupported loot type: ${lootType}`)
        }

        if (!option) {
            throw new Error(`Failed to generate loot option for loot type: ${lootType}`)
        }

        return option
    }
}
