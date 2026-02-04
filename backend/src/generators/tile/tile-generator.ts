import { Floor } from "../../models/floor.js"
import { Run } from "../../models/run.js"
import { Tile } from "../../models/tile.js"
import { FloorGenerator } from "../floor/floor-generator.js"
import { TileDao } from "../../database/tile-dao.js"
import { TileType } from "../../database/types/tiles.js"
import { User } from "../../models/user.js"

export class TileGenerator {
    static async generateTiles({
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
                    tiles.push(TileGenerator.createTileAsync({ user, run, floor, x, y, tile_type: TileType.EXIT }))
                    continue
                }

                tiles.push(TileGenerator.createTileAsync({ user, run, floor, x, y, tile_type: TileType.EMPTY }))
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

    static createTileAsync({
        user,
        run,
        floor,
        x,
        y,
        tile_type,
        hidden = true,
    }: {
        user: User
        run: Run
        floor: Floor
        x: number
        y: number
        tile_type: TileType
        hidden?: boolean
    }): Promise<Tile> {
        return TileDao.createTile({
            run_id: run.id,
            floor_id: floor.id,
            x,
            y,
            tile_type,
            hidden,
        }).then((tileSchema) => Tile.createFromSchema(tileSchema))
    }
}
