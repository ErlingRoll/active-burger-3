import { CharacterDao } from "../database/character-dao.js"
import { BaseSchema, CharacterSchema } from "../database/types/schemas.js"
import { GameEvent } from "../hub/types.js"
import { hub } from "../index.js"
import { ClassProps } from "../utils/type-utils.js"

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
    game_id: string

    constructor(schema: ClassProps<Character>) {
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
        this.game_id = schema.game_id
    }

    static async loadListByUserId(userId: string): Promise<Character[]> {
        const schemas = await CharacterDao.getCharactersByUserId(userId)
        return Promise.all(schemas.map((schema) => this.loadBySchema(schema)))
    }

    static async loadBySchema(schema: CharacterSchema): Promise<Character> {
        return new Character(schema as Character)
    }

    async sync(): Promise<Character> {
        return await CharacterDao.updateCharacter(this)
    }

    async gainExperience(exp: number): Promise<void> {
        this.level_progress += exp

        await this.checkLevelUp()

        hub.sendToUser(this.user_id, {
            event: GameEvent.CHARACTER_UPDATED,
            payload: {
                character: this,
            },
        })
    }

    private async checkLevelUp(): Promise<void> {
        if (this.level_progress >= this.level) {
            await this.levelUp()
        } else {
            await this.sync()
        }
    }

    private async levelUp(): Promise<void> {
        this.level += 1
        this.level_progress = 0
        this.hp += 3 + this.level * 2
        this.mana += 2 + this.level
        this.damage += this.level - 1
        await this.sync()
    }
}
