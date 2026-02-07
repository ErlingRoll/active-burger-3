import { TileGenerator } from "../generators/tile/tile-generator.js"
import { database } from "../index.js"
import { TileObject } from "../models/tile-object.js"
import { TileObjectSchema } from "./types/schemas.js"

export class TileObjectDao {
    static async createTileObject(schema: TileObjectSchema): Promise<TileObject | null> {
        const res = await database.from("tile_object").insert(schema).select()

        if (res.error) {
            throw new Error(`Failed to create tile object: ${res.error.message}`)
        }

        return TileGenerator.tileObjectFromModel(res.data![0] as unknown as TileObject)
    }

    static async getTileObjectByTileId(tileId: string): Promise<TileObject | null> {
        const res = await database.from("tile_object").select("*").eq("tile_id", tileId).single()

        if (res.error) {
            throw new Error(`Failed to get tile object by tile ID ${tileId}: ${res.error.message}`)
        }

        return res.data ? TileGenerator.tileObjectFromModel(res.data as unknown as TileObject) : null
    }
}
