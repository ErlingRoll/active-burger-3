import { Rarity, TileObjectType } from "./constants.js"
import { TileType } from "./tiles.js"

export interface BaseSchema {
    id: string
    created_at: string
}

export interface UserSchema {
    name: string
    discord_id: string | null
    discord_avatar: string | null
    admin: boolean
    essence: number
}

export interface CharacterSchema {
    user_id: string
    name: string
    level: number
    level_progress: number
    hp: number
    hp_regen: number
    damage: number
    mana: number
    mana_regen: number
    mana_cost: number
    cooldown: number
    texture: string
    party_position: number
}

export interface RunSchema {
    user_id: string
    active: boolean
    party_hp: number
    party_max_hp: number
    party_hp_regen: number
    party_mana: number
    party_max_mana: number
    party_mana_regen: number
    party_damage: number
    mods: Record<string, any>
    gold: number
    essence: number
}

export interface FloorSchema {
    run_id: string
    number: number
    mods: Record<string, any>
}

export interface TileSchema {
    run_id: string
    floor_id: string
    x: number
    y: number
    type: string
    hidden: boolean
    tile_type: TileType
}

export interface TileObjectSchema {
    tile_id: string
    tile_object_type: TileObjectType
    rarity: Rarity
    texture: string
    name: string
    hp?: number | null
    max_hp?: number | null
    damage?: number | null
}
