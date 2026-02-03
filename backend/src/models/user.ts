import { UserSchema } from "../database/types/schemas.js"
import { UserDao } from "../database/user-dao.js"
import { Character } from "./character.js"

export class User implements UserSchema {
    static PARTY_SIZE = 3

    id!: string
    name!: string
    created_at!: string
    discord_id!: string | null
    discord_avatar!: string | null
    admin!: boolean | null

    characters!: Character[]

    private constructor(schema: UserSchema) {
        this.id = schema.id
        this.name = schema.name
        this.created_at = schema.created_at
        this.discord_id = schema.discord_id
        this.discord_avatar = schema.discord_avatar
        this.admin = schema.admin
    }

    static async loadById(userId: string): Promise<User> {
        const userSchema = await UserDao.getUserById({ userId })
        if (!userSchema) throw new Error(`User with discord ID ${userId} not found`)

        const user = new User(userSchema)

        user.characters = await Character.loadListByUserId(user.id)

        return user
    }

    getParty(): Character[] {
        return this.characters.filter((c) => c.party_position !== null).slice(0, User.PARTY_SIZE)
    }
}
