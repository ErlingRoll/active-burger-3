import { Floor } from "../../models/floor.js"
import { Run } from "../../models/run.js"
import { Tile } from "../../models/tile.js"
import { FloorGenerator } from "../floor/floor-generator.js"
import { TileDao } from "../../database/tile-dao.js"
import { TileType } from "../../database/types/tiles.js"
import { User } from "../../models/user.js"
import { Rarity, TileObjectType } from "../../models/constants.js"
import { TileObject } from "../../models/tile-object.js"
import { Dice } from "../../game/dice.js"
import { TileObjectDao } from "../../database/tile-object-dao.js"
import { capitalize } from "../../utils/string-utils.js"
import { Chest } from "../../models/chest.js"
import { Exit } from "../../models/exit.js"

const tileWeights = {
    [TileType.EMPTY]: 50,
    [TileType.OBJECT]: 20,
}

const tileObjectWeights = {
    [TileObjectType.EXIT]: 1,
    [TileObjectType.CHEST]: 20,
}

export class TileGenerator {
    static async generateFloorTiles({
        user,
        run,
        floor,
    }: {
        user: User
        run: Run
        floor: Floor
    }): Promise<{ [x_y: string]: Tile }> {
        const floorWidth = FloorGenerator.DEFAULT_FLOOR_WIDTH
        const floorHeight = FloorGenerator.DEFAULT_FLOOR_HEIGHT

        const exitTileX = Math.floor(Math.random() * floorWidth)
        const exitTileY = Math.floor(Math.random() * floorHeight)

        const tiles: Promise<Tile>[] = []
        for (let x = 0; x < floorWidth; x++) {
            for (let y = 0; y < floorHeight; y++) {
                if (x === exitTileX && y === exitTileY) {
                    tiles.push(TileGenerator.generateExitTile({ run, floor, x, y }))
                    continue
                }

                tiles.push(TileGenerator.generateTile({ user, run, floor, x, y }))
            }
        }

        const tileMap = Promise.all(tiles).then((tileList) => {
            const tileMap: { [x_y: string]: Tile } = {}
            tileList.forEach((tile) => {
                tileMap[`${tile.x}_${tile.y}`] = tile
            })
            return tileMap
        })

        return tileMap
    }

    static async generateTile({
        user,
        run,
        floor,
        x,
        y,
        hidden = true,
    }: {
        user: User
        run: Run
        floor: Floor
        x: number
        y: number
        hidden?: boolean
    }): Promise<Tile> {
        const tileType = Dice.pickWeighted({ table: tileWeights, defaultValue: TileType.EMPTY })
        const hasObject = tileType === TileType.OBJECT
        const tileObjectType = Dice.pickWeighted({ table: tileObjectWeights, defaultValue: TileObjectType.CHEST })

        const tile = await TileDao.createTile({
            run_id: run.id,
            floor_id: floor.id,
            x,
            y,
            tile_type: tileType,
            hidden,
        }).then((tileSchema) => Tile.createFromSchema(tileSchema))

        if (hasObject) {
            tile.tile_object = await TileObjectDao.createTileObject({
                tile_id: tile.id,
                tile_object_type: tileObjectType,
                rarity: Rarity.COMMON,
                texture: tileObjectType,
                name: capitalize(tileObjectType),
                hp: null,
                max_hp: null,
                damage: null,
            }).then((tileObjectSchema) => (tileObjectSchema ? TileObject.fromSchema(tileObjectSchema) : null))
        }

        return tile
    }

    static async generateExitTile({
        run,
        floor,
        x,
        y,
    }: {
        run: Run
        floor: Floor
        x: number
        y: number
    }): Promise<Tile> {
        const tile = await TileDao.createTile({
            run_id: run.id,
            floor_id: floor.id,
            x,
            y,
            tile_type: TileType.OBJECT,
            hidden: true,
        }).then((tileSchema) => Tile.createFromSchema(tileSchema))
        tile.tile_object = await TileObjectDao.createTileObject({
            tile_id: tile.id,
            tile_object_type: TileObjectType.EXIT,
            rarity: Rarity.COMMON,
            texture: TileObjectType.EXIT,
            name: "Exit",
        }).then((tileObjectSchema) => (tileObjectSchema ? TileObject.fromSchema(tileObjectSchema) : null))

        return tile
    }

    static tileObjectFromModel(tileObject: TileObject | null): TileObject | null {
        if (!tileObject) return null
        switch (tileObject.tile_object_type) {
            case TileObjectType.CHEST:
                return Chest.fromModel(tileObject as Chest)
            case TileObjectType.EXIT:
                return Exit.fromModel(tileObject as Exit)
            default:
                console.error("Unknown tile object type:", tileObject.tile_object_type)
                return null
        }
    }
}
