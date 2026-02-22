import { TileGenerator } from "../generators/tile/tile-generator.js"
import { database } from "../index.js"
import { Floor } from "../models/floor.js"
import { Run } from "../models/run.js"
import { Tile } from "../models/tile.js"
import { ClassProps } from "../utils/type-utils.js"
import { batchUpdate } from "./database-utils.js"
import { FloorSchema, RunSchema, TileSchema } from "./types/schemas.js"

export class RunDao {
    static async getRunsByUserId(userId: string): Promise<Run[] | null> {
        const res = await database
            .from("run")
            .select(
                `*,
                floors:floor (
                    *,
                    tiles:tile (
                        *,
                        tile_object:tile_object (*)
                    )
                )`
            )
            .eq("user_id", userId)

        if (res.error) {
            console.error(res.error.message)
            return null
        }

        if (!res.data) return null

        const runs: any = res.data

        runs.forEach((run: any) => {
            this.mapFloorsAndTiles(run)
        })

        return runs.map((run: any) => new Run(run))
    }

    static async createRun(run: Partial<RunSchema>): Promise<Run | null> {
        const res = await database
            .from("run")
            .insert(run as RunSchema)
            .select()

        if (res.error) {
            throw new Error(`Failed to create run for user ID ${run.user_id}: ${res.error.message}`)
        }

        return res.data[0] ? new Run(res.data[0] as ClassProps<Run>) : null
    }

    static async updateRun(run: Run): Promise<Run> {
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
                gold: run.gold,
                essence: run.essence,
            })
            .eq("id", run.id)

        if (res.error) {
            throw new Error(`Failed to update run with ID ${run.id}: ${res.error.message}`)
        }

        return run
    }

    static async updateRuns(runs: Partial<ClassProps<Run>>[]): Promise<void> {
        await batchUpdate("run", runs)
    }

    // Takes the database result and creates the game objects associated with the run
    private static mapFloorsAndTiles(
        run: RunSchema & { floors: FloorSchema[] | Record<number, FloorSchema & { tiles: Record<string, TileSchema> }> }
    ): void {
        const floorArray = run.floors as FloorSchema[]
        const floorMap = floorArray.reduce((acc: any, floor: any) => {
            const tileMap = floor.tiles?.reduce((acc: any, tileSchema: any) => {
                const tile = new Tile({ ...tileSchema, floor: floor })
                const tileObject = tile.tile_object
                    ? TileGenerator.tileObjectFromModel({ ...tile.tile_object, tile: tile })
                    : null
                tile.tile_object = tileObject
                acc[tile.x + "_" + tile.y] = tile
                return acc
            }, {})
            acc[floor.number] = new Floor({ ...floor, tiles: tileMap })
            return acc
        }, {})
        run.floors = floorMap
    }
}
