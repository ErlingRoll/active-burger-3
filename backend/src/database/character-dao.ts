import { database } from "../index.js"
import { Character } from "../models/character.js"
import { CharacterName } from "../models/constants.js"
import { ClassProps } from "../utils/type-utils.js"
import { CharacterSchema } from "./types/schemas.js"

export class CharacterDao {
    static async createCharacter(character: Partial<CharacterSchema>): Promise<CharacterSchema | null> {
        const res = await database
            .from("character")
            .insert(character as CharacterSchema)
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

    static async getUserCharacterByGameId({
        user_id,
        game_id,
    }: {
        user_id: string
        game_id: CharacterName
    }): Promise<Character | null> {
        const res = await database.from("character").select("*").eq("user_id", user_id).eq("game_id", game_id).single()

        if (res.error) {
            console.error(res.error.message)
            return null
        }

        return res.data ? new Character(res.data as ClassProps<Character>) : null
    }

    static async updateCharacter(character: Character): Promise<Character> {
        const res = await database.from("character").update(character).eq("id", character.id)

        if (res.error) {
            console.error(res.error.message)
        }

        return character
    }
}
