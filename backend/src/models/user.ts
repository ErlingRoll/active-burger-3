import { BaseSchema, UserSchema } from "../database/types/schemas.js"
import { UserDao } from "../database/user-dao.js"
import { GameEvent } from "../hub/types.js"
import { gamesync, hub } from "../index.js"
import { ClassProps } from "../utils/type-utils.js"
import { Character } from "./character.js"
import { Item } from "./item/item.js"

export class User implements BaseSchema, UserSchema {
    static PARTY_SIZE = 3

    id: string
    name: string
    created_at: string
    discord_id: string | null
    discord_avatar: string | null
    admin: boolean
    essence: number

    characters!: Character[]
    items!: Item[]

    constructor(user: ClassProps<User>) {
        this.id = user.id
        this.created_at = user.created_at
        this.name = user.name
        this.discord_id = user.discord_id
        this.discord_avatar = user.discord_avatar
        this.admin = user.admin
        this.essence = user.essence
        this.characters = user.characters || []
        this.items = user.items || []
    }

    async sync(): Promise<void> {
        await UserDao.updateUser(this)
    }

    async updateClient(): Promise<void> {
        gamesync.markDirty(this)
        hub.sendToUser(this.id, {
            event: GameEvent.USER_UPDATED,
            payload: {
                user: this,
            },
        })
    }

    getSchema(): UserSchema {
        const { id, created_at, characters, items, ...userSchema } = this
        return userSchema
    }

    static async loadById(userId: string): Promise<User> {
        const userSchema = await UserDao.getUserById({ userId })
        if (!userSchema) throw new Error(`User with discord ID ${userId} not found`)

        const user = await User.loadBySchema(userSchema)

        user.characters = await Character.loadListByUserId(user.id)

        return user
    }

    static async loadBySchema(schema: UserSchema): Promise<User> {
        const user = new User(schema as User)
        return user
    }

    getParty(): Character[] {
        return this.characters.filter((c) => c.party_position !== null).slice(0, User.PARTY_SIZE)
    }

    async addEssence(amount: number): Promise<void> {
        this.essence += amount
        await this.updateClient()
    }
}
