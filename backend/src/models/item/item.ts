import { BaseSchema, ItemSchema } from "../../database/types/schemas.js"
import { ClassProps } from "../../utils/type-utils.js"
import { CharacterName, ItemType, Rarity } from "../constants.js"

export class Item implements BaseSchema, ItemSchema {
    id: string
    created_at: string
    user_id: string
    game_id: string
    item_type: ItemType
    name: string
    description: string | null = null
    texture: string
    rarity: Rarity
    stackable: boolean
    count: number = 1
    value: number
    character_shard: CharacterName | null = null

    constructor(item: ClassProps<Item>) {
        this.id = item.id
        this.created_at = item.created_at
        this.user_id = item.user_id
        this.game_id = item.game_id
        this.item_type = item.item_type
        this.name = item.name
        this.description = item.description
        this.texture = item.texture
        this.rarity = item.rarity
        this.stackable = item.stackable
        this.count = item.count
        this.value = item.value
        this.character_shard = item.character_shard
    }

    getSchema(): ItemSchema {
        const { id, created_at, ...itemSchema } = this
        return itemSchema
    }
}
