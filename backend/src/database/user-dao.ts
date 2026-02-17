import { database } from "../index.js"
import { User } from "../models/user.js"
import { ClassProps } from "../utils/type-utils.js"
import { UserSchema } from "./types/schemas.js"

export class UserDao {
    static async getUserByDiscordId({ discordId }: { discordId: string }): Promise<User | null> {
        const res = await database
            .from("user")
            .select(
                `*
                , characters:character (*)
                , items:item (*)`
            )
            .eq("discord_id", discordId)
        return res.data ? new User(res.data[0] as User) : null
    }

    static async getUserById({ userId }: { userId: string }): Promise<User | null> {
        const res = await database
            .from("user")
            .select(
                `*
                , characters:character (*)
                , items:item (*)`
            )
            .eq("id", userId)
        return res.data ? new User(res.data[0] as User) : null
    }

    static async createUserWithDiscordIdAndName(discordId: string, name: string): Promise<User> {
        const res = await database
            .from("user")
            .insert({
                discord_id: discordId,
                name: name,
            })
            .select()

        if (res.error || !res.data || res.data.length === 0) {
            throw new Error(`Failed to create user with discord ID ${discordId}: ${res.error?.message}`)
        }

        return await User.loadBySchema(res.data[0] as UserSchema)
    }

    static async updateUser(user: User): Promise<User> {
        const res = await database.from("user").update(user.getSchema()).eq("id", user.id)
        if (res.error) {
            throw new Error(`Failed to update user with ID ${user.id}: ${res.error.message}`)
        }
        return user
    }
}
