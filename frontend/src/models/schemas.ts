import { TileType } from "./tiles.ts"

export interface UserSchema {
    id: string
    created_at: string
    name: string
    discord_id: string | null
    discord_avatar: string | null
    admin: boolean | null
}

export interface CharacterSchema {
    id: string
    created_at: string
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
    id: string
    created_at: string
    user_id: string
    active: boolean
    party_hp: number
    party_hp_regen: number
    party_mana: number
    party_mana_regen: number
    party_damage: number
    mods: Record<string, any>
}

export interface FloorSchema {
    id: string
    created_at: string
    run_id: string
    number: number
    mods: Record<string, any>
}

export interface TileSchema {
    id: string
    created_at: string
    run_id: string
    floor_id: string
    x: number
    y: number
    type: string
    hidden: boolean
    tile_type: TileType
}
