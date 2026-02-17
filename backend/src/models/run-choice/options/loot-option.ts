import { ItemDao } from "../../../database/item-dao.js"
import { TileType } from "../../../database/types/tiles.js"
import { GameEvent } from "../../../hub/types.js"
import { hub } from "../../../index.js"
import { LootType } from "../../constants.js"
import { Item } from "../../item/item.js"
import { Run } from "../../run.js"
import { Tile } from "../../tile.js"
import { User } from "../../user.js"
import { RunOption } from "../run-option.js"

export class LootRunOption extends RunOption {
    count: number
    loot_type: LootType
    item: Item | null

    constructor(option: { count: number; loot_type: LootType; item?: Item | null } & RunOption) {
        super(option)
        this.count = option.count
        this.loot_type = option.loot_type
        this.item = option.item ? new Item(option.item) : null
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

        databasePromises.push(this.giveLoot({ user, run }))

        await Promise.all(databasePromises)

        hub.sendToUser(user.id, {
            event: GameEvent.RUN_STATS_UPDATED,
            payload: {
                run_stats: run.getStats(),
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
                        item: this.item,
                    },
                ],
            },
        })
    }

    async giveLoot({ user, run }: { user: User; run: Run }): Promise<void | any> {
        switch (this.loot_type) {
            case LootType.GOLD:
                run.gold += this.count
                return await run.sync()
            case LootType.ESSENCE:
                run.essence += this.count
                return await run.sync()
            case LootType.ITEM:
                if (!this.item) {
                    console.error("LootRunOption of type ITEM must have an item")
                    return
                }
                return await ItemDao.createItem(this.item.getSchema())
        }
    }
}
