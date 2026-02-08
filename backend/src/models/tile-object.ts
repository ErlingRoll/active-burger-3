import { TileObjectDao } from "../database/tile-object-dao.js"
import { BaseSchema, TileObjectSchema } from "../database/types/schemas.js"
import { Rarity, TileObjectType } from "./constants.js"
import { Run } from "./run.js"
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

    constructor(tileObject: {
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
    }) {
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
    }

    static fromSchema(tileObjectSchema: TileObjectSchema): TileObject {
        if (!tileObjectSchema) {
            throw new Error("Cannot create TileObject from null or undefined schema")
        }
        return new TileObject({ ...tileObjectSchema, id: "", created_at: "" })
    }

    static fromModel(tileObject: TileObject): TileObject {
        return new TileObject(tileObject)
    }

    async sync(): Promise<void> {
        throw new Error("Method not implemented.")
    }

    async delete(): Promise<void> {
        await TileObjectDao.deleteById(this.id)
    }

    async activate({ user, activeRun }: { user: User; activeRun: Run }): Promise<void> {
        console.warn(`Activating tile object of type [${this.tile_object_type}] is not implemented.`)
    }
}
