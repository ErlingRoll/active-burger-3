import { CharacterSchema, UserSchema } from "../models/account"
import { RenderObject } from "../models/object"
import { FloorSchema, RunSchema, TileSchema } from "../models/schemas"

export interface User extends UserSchema {
    characters: CharacterSchema[]
}

export interface Character extends CharacterSchema {}

export interface Run extends RunSchema {
    floors: Floor[]
}

export interface Floor extends FloorSchema {
    tiles: Tile[]
}

export interface Tile extends TileSchema {}

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
