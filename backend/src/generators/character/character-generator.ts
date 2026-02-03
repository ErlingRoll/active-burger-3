import { CharacterDao } from "../../database/character-dao.js"
import { CharacterSchema } from "../../database/types/schemas.js"
import { Character } from "../../models/character.js"

export enum CharacterName {
    CLYDE = "clyde",
}

export const clyde: Partial<CharacterSchema> = {
    name: "Clyde",
    texture: "clyde",
    hp: 10,
    hp_regen: 1,
    damage: 2,
    mana: 10,
    mana_regen: 1,
    mana_cost: 5,
    cooldown: 3,
}

export const characters: { [key: string]: Partial<CharacterSchema> } = {
    [CharacterName.CLYDE]: clyde,
}

export async function generateCharacter({
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
    }

    character = { ...character, ...override }

    const createdCharacter = await CharacterDao.createCharacter({ userId, character })

    if (!createdCharacter) {
        console.error("Could not create character for user:", userId, "with name:", name)
        return null
    }

    return Character.loadBySchema(createdCharacter)
}
