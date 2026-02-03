export interface User {
    id: string
    name: string
    admin: boolean
}

export interface UserSchema {
    id: string
    created_at: string
    name: string
    discord_id: string
    discord_avatar: string
    admin: boolean
    characters: CharacterSchema[]
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
