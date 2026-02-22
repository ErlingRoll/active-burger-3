import { Dice } from "../game/dice.js"
import { characterRarityTable } from "../generators/character/character-generator.js"
import { GameEvent } from "../hub/types.js"
import { hub } from "../index.js"
import { capitalize } from "../utils/string-utils.js"
import { CharacterName, ItemType, LootType, Rarity, RunOptionType } from "./constants.js"
import { SoulShard } from "./item/soul-shard.js"
import { LootRunOption } from "./run-choice/options/loot-option.js"
import { RunChoice } from "./run-choice/run-choice.js"
import { Run } from "./run.js"
import { TileObject } from "./tile-object.js"
import { User } from "./user.js"

export class Chest extends TileObject {
    static DEFAULT_CHOICE_COUNT = 3
    static OPTION_TYPE_TABLE = {
        [RunOptionType.LOOT]: 1,
    }
    static LOOT_TYPE_TABLE = { [LootType.GOLD]: 1, [LootType.ESSENCE]: 1, [LootType.ITEM]: 1 }
    static ITEM_LOOT_TABLE = { [ItemType.SOUL_SHARD]: 1 }

    constructor(chest: any) {
        super(chest)
    }

    async activate({ user, activeRun }: { user: User; activeRun: Run }): Promise<void> {
        const runChoice = new RunChoice(
            this.tile_id,
            Array.from({ length: Chest.DEFAULT_CHOICE_COUNT }, () => {
                // const lootOptionType = Dice.pickWeighted({table: Chest.OPTION_TYPE_TABLE, defaultValue: RunOptionType.LOOT})
                const option = this.spawnLootOption({ user })
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

    spawnLootOption({ user }: { user: User }): LootRunOption {
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
                    floor_number: this.tile.floor.number,
                    tile_x: this.tile.x,
                    tile_y: this.tile.y,
                    tile: this.tile,
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
                    floor_number: this.tile.floor.number,
                    tile_x: this.tile.x,
                    tile_y: this.tile.y,
                    tile: this.tile,
                })
                break
            case LootType.ITEM:
                return this.spawnItemOption({ user })
            default:
                console.error(`Unsupported loot type: ${lootType}`)
        }

        if (!option) {
            throw new Error(`Failed to generate loot option for loot type: ${lootType}`)
        }

        return option
    }

    spawnItemOption({ user }: { user: User }): LootRunOption {
        const itemType = Dice.pickWeighted({ table: Chest.ITEM_LOOT_TABLE, defaultValue: ItemType.SOUL_SHARD })

        switch (itemType) {
            case ItemType.SOUL_SHARD:
                const characterName = Dice.pickWeighted({
                    table: characterRarityTable,
                    defaultValue: CharacterName.CLYDE,
                })

                const item = new SoulShard({
                    id: "",
                    created_at: new Date().toISOString(),
                    user_id: user.id,
                    name: `${capitalize(characterName)} Soul Shard`,
                    description: `A soul shard containing the essence of ${capitalize(characterName)}`,
                    character_shard: characterName,
                })

                return new LootRunOption({
                    title: "Soul Shard",
                    description: "A fragment of a soul. It pulses with dark energy.",
                    rarity: Rarity.LEGENDARY,
                    type: RunOptionType.LOOT,
                    loot_type: LootType.ITEM,
                    texture: "item/misc/soul_shard",
                    count: 1,
                    item: item,
                    floor_number: this.tile.floor.number,
                    tile_x: this.tile.x,
                    tile_y: this.tile.y,
                    tile: this.tile,
                })
            default:
                console.error(`Unsupported item type: ${itemType}`)
                throw new Error(`Unsupported item type: ${itemType}`)
        }
    }
}
