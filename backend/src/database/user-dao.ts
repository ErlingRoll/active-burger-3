import { database } from "../index.js"
import { UserSchema } from "./types/schemas.js"

export class UserDao {
    static async getUserByDiscordId({ discordId }: { discordId: string }): Promise<UserSchema | null> {
        const res = await database.from("user").select("*").eq("discord_id", discordId).select()
        return res.data ? (res.data[0] as UserSchema) : null
    }

    static async getUserById({ userId }: { userId: string }): Promise<UserSchema | null> {
        const res = await database.from("user").select("*").eq("id", userId).select()
        return res.data ? (res.data[0] as UserSchema) : null
    }

    static async createUserWithDiscordIdAndName(discordId: string, name: string): Promise<UserSchema> {
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

        return res.data[0] as UserSchema
    }

    static async updateUser(user: UserSchema): Promise<UserSchema> {
        const res = await database
            .from("user")
            .update({
                name: user.name,
                discord_id: user.discord_id,
                discord_avatar: user.discord_avatar,
                admin: user.admin,
            })
            .eq("id", user.id)
        if (res.error) {
            throw new Error(`Failed to update user with ID ${user.id}: ${res.error.message}`)
        }
        return user
    }
}
