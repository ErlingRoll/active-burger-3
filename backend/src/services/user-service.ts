import { UserSchema } from "../database/types/schemas.js"
import { UserDao } from "../database/user-dao.js"
import { CharacterName, generateCharacter } from "../generators/character/character-generator.js"
import { User } from "../models/user.js"

export class UserService {
    private static async initUser({
        discordId,
        discordName,
    }: {
        discordId: string
        discordName: string
    }): Promise<UserSchema> {
        const userSchema = await UserDao.createUserWithDiscordIdAndName(discordId, discordName)
        if (!userSchema) {
            throw new Error(`Failed to initialize user with discord ID ${discordId}`)
        }

        const firstCharacter = await generateCharacter({
            userId: userSchema.id,
            name: CharacterName.CLYDE,
            override: { party_position: 0 },
        })
        if (!firstCharacter) {
            throw new Error(`Failed to create initial character for user with ID ${userSchema.id}`)
        }

        return userSchema
    }

    static async getOrCreateDiscordUser(discordId: string, discordName: string): Promise<User | null> {
        if (!discordId) {
            return null
        }
        let userSchema = await UserDao.getUserByDiscordId({ discordId })
        if (!userSchema) {
            userSchema = await this.initUser({ discordId, discordName })
        }

        return User.loadById(userSchema.id)
    }
}
