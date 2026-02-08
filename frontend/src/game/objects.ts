import { CharacterSchema, UserSchema } from "../models/account"
import { LootType, Rarity, RunOptionType } from "../models/constants"
import { RenderObject } from "../models/object"
import { BaseSchema, FloorSchema, RunSchema, TileObjectSchema, TileSchema } from "../models/schemas"

export interface User extends BaseSchema, UserSchema {
    characters: CharacterSchema[]
}

export interface Character extends BaseSchema, CharacterSchema {}

export interface Run extends BaseSchema, RunSchema {
    floors: Floor[]
}

export interface Floor extends BaseSchema, FloorSchema {
    tiles: Tile[]
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

export const TERRAIN_OBJECTS: { [object_id: string]: Partial<RenderObject> } = {
    gold_ore: {
        name: "Gold Ore",
        object_id: "gold_ore",
        texture: "terrain/ore/gold",
    },
    teleporter: {
        name: "Teleporter",
        object_id: "teleporter",
        texture: "misc/teleporter",
    },
    shopkeeper: {
        name: "Shopkeeper",
        object_id: "shopkeeper",
        texture: "npcs/shopkeeper",
    },
    crafting_bench: {
        name: "Crafting Bench",
        object_id: "crafting_bench",
        texture: "misc/crafting_bench",
    },
}
