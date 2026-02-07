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
    }): Promise<User> {
        const user = await UserDao.createUserWithDiscordIdAndName(discordId, discordName)
        if (!user) {
            throw new Error(`Failed to initialize user with discord ID ${discordId}`)
        }

        const firstCharacter = await generateCharacter({
            userId: user.id,
            name: CharacterName.CLYDE,
            override: { party_position: 0 },
        })

        if (!firstCharacter) {
            throw new Error(`Failed to create initial character for user with ID ${user.id}`)
        }

        user.characters = [firstCharacter]

        return user
    }

    static async getOrCreateDiscordUser(discordId: string, discordName: string): Promise<User | null> {
        if (!discordId) {
            return null
        }
        let user = await UserDao.getUserByDiscordId({ discordId })
        if (!user) {
            user = await this.initUser({ discordId, discordName })
        }

        if (!user) {
            throw new Error(`Failed to get or create user with discord ID ${discordId}`)
        }

        return User.loadById(user.id)
    }
}
