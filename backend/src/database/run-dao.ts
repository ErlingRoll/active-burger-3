import { database } from "../index.js"
import { RunSchema } from "./types/schemas.js"

export class RunDao {
    static async getActiveRunByUserId(userId: string): Promise<RunSchema | null> {
        const res = await database.from("run").select("*").eq("user_id", userId).eq("active", true).select()
        if (res.error) {
            console.error(res.error.message)
            return null
        }

        if (res.data && res.data.length > 1) {
            throw new Error(`Found ${res.data.length} active runs for user ID ${userId}`)
        }

        return res.data ? (res.data[0] as unknown as RunSchema) : null
    }

    static async createRun(run: Partial<RunSchema> | any): Promise<RunSchema | null> {
        const res = await database
            .from("run")
            .insert({
                user_id: run.user_id,
                active: run.active,
                party_hp: run.party_hp,
                party_hp_regen: run.party_hp_regen,
                party_mana: run.party_mana,
                party_mana_regen: run.party_mana_regen,
                party_damage: run.party_damage,
                mods: run.mods,
            })
            .select()

        if (res.error) {
            throw new Error(`Failed to create run for user ID ${run.user_id}: ${res.error.message}`)
        }

        return res.data ? (res.data[0] as unknown as RunSchema) : null
    }

    static async updateRun(run: RunSchema): Promise<RunSchema> {
        const res = await database
            .from("run")
            .update({
                active: run.active,
                party_hp: run.party_hp,
                party_hp_regen: run.party_hp_regen,
                party_mana: run.party_mana,
                party_mana_regen: run.party_mana_regen,
                party_damage: run.party_damage,
                mods: run.mods,
            })
            .eq("id", run.id)

        if (res.error) {
            throw new Error(`Failed to update run with ID ${run.id}: ${res.error.message}`)
        }

        return run
    }
}
