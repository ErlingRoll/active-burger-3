import { TileObjectDao } from "../database/tile-object-dao.js"
import { BaseSchema, TileObjectSchema } from "../database/types/schemas.js"
import { gamesync } from "../index.js"
import { ClassProps } from "../utils/type-utils.js"
import { Rarity, TileObjectType } from "./constants.js"
import { Run } from "./run.js"
import { Tile } from "./tile.js"
import { User } from "./user.js"

export class TileObject implements BaseSchema, TileObjectSchema {
    id: string
    created_at: string
    tile_id: string
    tile_object_type: TileObjectType
    rarity: Rarity
    texture: string
    name: string
    hp?: number | null
    max_hp?: number | null
    damage?: number | null
    game_id?: string | null
    deleted: boolean = false

    tile: Tile

    constructor(tileObject: ClassProps<TileObject>) {
        this.id = tileObject.id
        this.created_at = tileObject.created_at
        this.tile_id = tileObject.tile_id
        this.tile_object_type = tileObject.tile_object_type
        this.rarity = tileObject.rarity
        this.texture = tileObject.texture
        this.name = tileObject.name
        this.hp = tileObject.hp
        this.max_hp = tileObject.max_hp
        this.damage = tileObject.damage
        this.game_id = tileObject.game_id
        this.deleted = tileObject.deleted
        this.tile = tileObject.tile
    }

    async sync(): Promise<void> {
        if (this.deleted) {
            TileObjectDao.deleteById(this.id)
        }
        TileObjectDao.updateTileObject(this)
    }

    async delete(): Promise<void> {
        if (!this.tile) {
            console.error("Cannot delete tile object without associated tile")
            return
        }
        if (!this.tile.deleteTileObject) {
            console.error("Associated tile does not have deleteTileObject method")
            return
        }
        this.tile.deleteTileObject()

        this.deleted = true
        gamesync.markDirty(this)
    }

    async activate({ user, activeRun }: { user: User; activeRun: Run }): Promise<void> {
        console.warn(`Activating tile object of type [${this.tile_object_type}] is not implemented.`)
    }
}
