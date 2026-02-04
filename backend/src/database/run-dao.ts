import { database } from "../index.js"
import { Run } from "../models/run.js"
import { RunSchema } from "./types/schemas.js"

export class RunDao {
    static async getActiveRunByUserId(userId: string): Promise<Run | null> {
        const res = await database
            .from("run")
            .select(
                `*,
                floors:floor (
                    *,
                    tiles:tile ( *  )
                )`
            )
            .eq("user_id", userId)
            .eq("active", true)

        if (res.error) {
            console.error(res.error.message)
            return null
        }

        if (res.data && res.data.length > 1) {
            throw new Error(`Found ${res.data.length} active runs for user ID ${userId}`)
        }

        const fullRun: any = res.data[0]

        if (!fullRun) return null

        fullRun.floors.forEach((floor: any) => {
            floor.tiles = floor.tiles.reduce((acc: any, tile: any) => {
                acc[tile.x + "_" + tile.y] = tile
                return acc
            }, {})
        })

        return new Run(fullRun)
    }

    static async createRun(run: Partial<RunSchema> | any): Promise<RunSchema> {
        const res = await database.from("run").insert(run).select()

        if (res.error) {
            throw new Error(`Failed to create run for user ID ${run.user_id}: ${res.error.message}`)
        }

        return res.data[0] as unknown as RunSchema
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
