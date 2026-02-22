import { CharacterSchema, UserSchema } from "../models/account"
import { LootType, Rarity, RunOptionType } from "../models/constants"
import { BaseSchema, FloorSchema, ItemSchema, RunSchema, TileObjectSchema, TileSchema } from "../models/schemas"

export interface User extends BaseSchema, UserSchema {
    characters: CharacterSchema[]
}

export interface Character extends BaseSchema, CharacterSchema {}

export interface Run extends BaseSchema, RunSchema {
    floors: Record<string, Floor>
}

export interface Floor extends BaseSchema, FloorSchema {
    tiles: Record<string, Tile>
}

export interface Tile extends BaseSchema, TileSchema {
    tile_object: TileObject | null
}

export interface TileObject extends BaseSchema, TileObjectSchema {}

export interface RunChoice {
    tile_id: string | null
    options: AnyRunOption[]
}
export interface RunOption {
    title: string | null
    texture: string | null
    description: string | null
    rarity: Rarity
    type: RunOptionType
}

export type AnyRunOption = LootRunOption // | other option types in the future

export interface LootRunOption extends RunOption {
    loot_type: LootType
    count: number
}

export interface Item extends BaseSchema, ItemSchema {}
