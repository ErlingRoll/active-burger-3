import { TileType } from "../../../database/types/tiles.js"
import { GameEvent } from "../../../hub/types.js"
import { hub } from "../../../index.js"
import { Run } from "../../run.js"
import { Tile } from "../../tile.js"
import { User } from "../../user.js"
import { RunOption } from "../run-option.js"

export enum LootType {
    GOLD = "gold",
    ESSENCE = "essence",
    ITEM = "item",
}

export class LootRunOption extends RunOption {
    count: number
    loot_type: LootType

    constructor(option: { count: number; loot_type: LootType } & RunOption) {
        super(option)
        this.count = option.count
        this.loot_type = option.loot_type
    }

    async select({ user, run, tile }: { user: User; run: Run; tile: Tile }): Promise<void> {
        const databasePromises = []
        databasePromises.push(tile.tile_object?.delete())

        const updatedTile = new Tile({ ...tile, tile_object: null, tile_type: TileType.EMPTY })
        databasePromises.push(
            hub.sendToUser(user.id, {
                event: GameEvent.TILE_UPDATED,
                payload: {
                    tile: updatedTile,
                },
            })
        )

        const updatedRun = new Run({
            ...run,
            gold: run.gold + (this.loot_type === LootType.GOLD ? this.count : 0),
            essence: run.essence + (this.loot_type === LootType.ESSENCE ? this.count : 0),
        })
        databasePromises.push(updatedRun.sync())

        await Promise.all(databasePromises)

        hub.sendToUser(user.id, {
            event: GameEvent.RUN_STATS_UPDATED,
            payload: {
                run_stats: updatedRun.getStats(),
            },
        })

        hub.sendToUser(user.id, {
            event: GameEvent.LOOT_DROPPED,
            payload: {
                items: [
                    {
                        name: this.title,
                        texture: this.texture,
                        count: this.count,
                        rarity: this.rarity,
                        loot_type: this.loot_type,
                    },
                ],
            },
        })
    }
}
