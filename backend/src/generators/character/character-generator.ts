import { CharacterDao } from "../../database/character-dao.js"
import { CharacterSchema } from "../../database/types/schemas.js"
import { Character } from "../../models/character.js"
import { CharacterName } from "../../models/constants.js"

export const characterRarityTable = {
    [CharacterName.CLYDE]: 1,
    [CharacterName.LYERA]: 5,
}

export const clyde: Partial<CharacterSchema> = {
    name: "Clyde",
    game_id: CharacterName.CLYDE,
    texture: "clyde",
    hp: 10,
    hp_regen: 1,
    damage: 2,
    mana: 10,
    mana_regen: 1,
    mana_cost: 5,
    cooldown: 3,
}

export const lyera: Partial<CharacterSchema> = {
    name: "Lyera",
    game_id: CharacterName.LYERA,
    texture: "lyera",
    hp: 8,
    hp_regen: 1,
    damage: 2,
    mana: 15,
    mana_regen: 2,
    mana_cost: 10,
    cooldown: 5,
}

export const characters: { [key: string]: Partial<CharacterSchema> } = {
    [CharacterName.CLYDE]: clyde,
    [CharacterName.LYERA]: lyera,
}

export class CharacterGenerator {
    static async generateCharacter({
        userId,
        name,
        override = {},
    }: {
        userId: string
        name: CharacterName
        override?: Partial<CharacterSchema>
    }): Promise<Character | null> {
        let baseCharacter = characters[name.toLowerCase()]
        if (!baseCharacter) {
            throw new Error(`Character template not found for name: ${name}`)
        }

        let character: CharacterSchema | any = {
            user_id: userId,
            name: baseCharacter.name,
            level: baseCharacter.level || 1,
            level_progress: baseCharacter.level_progress || 0,
            hp: baseCharacter.hp,
            hp_regen: baseCharacter.hp_regen,
            damage: baseCharacter.damage,
            mana: baseCharacter.mana,
            mana_regen: baseCharacter.mana_regen,
            mana_cost: baseCharacter.mana_cost,
            cooldown: baseCharacter.cooldown,
            texture: baseCharacter.texture,
            party_position: null,
            game_id: baseCharacter.game_id,
        }

        character = { ...character, ...override }

        const createdCharacter = await CharacterDao.createCharacter(character)

        if (!createdCharacter) {
            console.error("Could not create character for user:", userId, "with name:", name)
            return null
        }

        return createdCharacter
    }
}
