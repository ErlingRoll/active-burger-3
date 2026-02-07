import { CharacterDao } from "../database/character-dao.js"
import { BaseSchema, CharacterSchema } from "../database/types/schemas.js"

export class Character implements BaseSchema, CharacterSchema {
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

    private constructor(schema: Character) {
        this.id = schema.id
        this.created_at = schema.created_at
        this.user_id = schema.user_id
        this.name = schema.name
        this.level = schema.level
        this.level_progress = schema.level_progress
        this.hp = schema.hp
        this.hp_regen = schema.hp_regen
        this.damage = schema.damage
        this.mana = schema.mana
        this.mana_regen = schema.mana_regen
        this.mana_cost = schema.mana_cost
        this.cooldown = schema.cooldown
        this.texture = schema.texture
        this.party_position = schema.party_position
    }

    static async loadListByUserId(userId: string): Promise<Character[]> {
        const schemas = await CharacterDao.getCharactersByUserId(userId)
        return Promise.all(schemas.map((schema) => this.loadBySchema(schema)))
    }

    static async loadBySchema(schema: CharacterSchema): Promise<Character> {
        return new Character(schema as Character)
    }
}
