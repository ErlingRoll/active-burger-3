import { ClassProps } from "../../utils/type-utils.js"
import { ItemType, Rarity } from "../constants.js"
import { Item } from "./item.js"

export class SoulShard extends Item {
    constructor(
        item: Omit<
            ClassProps<SoulShard>,
            "game_id" | "item_type" | "stackable" | "count" | "rarity" | "value" | "texture"
        >
    ) {
        super({
            ...item,
            game_id: ItemType.SOUL_SHARD,
            item_type: ItemType.SOUL_SHARD,
            stackable: false,
            count: 1,
            rarity: Rarity.LEGENDARY,
            value: 100,
            texture: "item/misc/soul_shard",
        })
    }
}
