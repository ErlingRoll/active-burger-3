import { database } from "../index.js"
import { CharacterSchema } from "./types/schemas.js"

export class CharacterDao {
    static async createCharacter({
        userId,
        character,
    }: {
        userId: string
        character: Partial<CharacterSchema> | any
    }): Promise<CharacterSchema | null> {
        const res = await database
            .from("character")
            .insert({
                user_id: userId,
                name: character.name,
                level: character.level,
                level_progress: character.level_progress,
                hp: character.hp,
                hp_regen: character.hp_regen,
                damage: character.damage,
                mana: character.mana,
                mana_regen: character.mana_regen,
                mana_cost: character.mana_cost,
                cooldown: character.cooldown,
                texture: character.texture,
                party_position: character.party_position,
            })
            .select()

        if (res.error) {
            console.error(res.error.message)
        }

        return res.data ? (res.data[0] as unknown as CharacterSchema) : null
    }

    static async getCharactersByUserId(userId: string): Promise<CharacterSchema[]> {
        const res = await database
            .from("character")
            .select("*")
            .eq("user_id", userId)
            .order("party_position", { ascending: true })

        if (res.error) {
            console.error(res.error.message)
        }

        return res.data ? (res.data as unknown as CharacterSchema[]) : []
    }
}
