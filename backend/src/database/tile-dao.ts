import { database } from "../index.js"
import { Tile } from "../models/tile.js"
import { TileSchema } from "./types/schemas.js"

export class TileDao {
    static async getTileByFloorId(floorId: string): Promise<{ [x_y: string]: TileSchema }> {
        const res = await database.from("tile").select("*").eq("floor_id", floorId)
        if (res.error) {
            throw new Error(`Failed to get tiles by floor ID ${floorId}: ${res.error.message}`)
        }
        const tiles: { [x_y: string]: TileSchema } = {}
        if (res.data) {
            for (const row of res.data) {
                const tile = row as unknown as TileSchema
                tiles[`${tile.x}_${tile.y}`] = tile
            }
        }
        return tiles
    }

    static async getTileById(id: string): Promise<Tile> {
        const res = await database.from("tile").select("*").eq("id", id).single()
        if (res.error) {
            throw new Error(`Failed to get tile by ID ${id}: ${res.error.message}`)
        }
        return res.data as unknown as Tile
    }

    static async createTile(tile: Partial<TileSchema> | any): Promise<TileSchema> {
        const res = await database.from("tile").insert(tile).select()
        if (res.error) {
            throw new Error(`Failed to create tile: ${res.error.message}`)
        }
        return res.data![0] as unknown as TileSchema
    }

    static async createTiles(tiles: TileSchema[] | any): Promise<TileSchema[]> {
        const res = await database.from("tile").insert(tiles).select()

        if (res.error) {
            throw new Error(`Failed to create tiles: ${res.error.message}`)
        }

        return res.data as unknown as TileSchema[]
    }

    static async updateTile(tile: TileSchema): Promise<TileSchema> {
        const res = await database
            .from("tile")
            .update({
                type: tile.type,
                hidden: tile.hidden,
                tile_type: tile.tile_type,
            })
            .eq("id", tile.id)
        if (res.error) {
            throw new Error(`Failed to update tile ID ${tile.id}: ${res.error.message}`)
        }
        return tile
    }
}
