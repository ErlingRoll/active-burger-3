import { database } from "../index.js"
import { FloorSchema } from "./types/schemas.js"

export class FloorDao {
    static async createFloor(floor: Partial<FloorSchema> | any): Promise<FloorSchema> {
        const res = await database
            .from("floor")
            .insert({
                run_id: floor.run_id,
                number: floor.number,
                mods: floor.mods,
            })
            .select()

        if (res.error) {
            throw new Error(`Failed to create floor for run ID ${floor.run_id}: ${res.error.message}`)
        }

        return res.data[0] as unknown as FloorSchema
    }

    static async getFloorsByRunId(runId: string): Promise<FloorSchema[]> {
        const res = await database.from("floor").select("*").eq("run_id", runId).order("number", { ascending: true })
        if (res.error) {
            throw new Error(`Failed to get floors for run ID ${runId}: ${res.error.message}`)
        }
        return res.data ? (res.data as unknown as FloorSchema[]) : []
    }

    static async updateFloor(floor: FloorSchema): Promise<FloorSchema> {
        const res = await database
            .from("floor")
            .update({
                mods: floor.mods,
            })
            .eq("id", floor.id)
        if (res.error) {
            throw new Error(`Failed to update floor with ID ${floor.id}: ${res.error.message}`)
        }
        return floor
    }
}
