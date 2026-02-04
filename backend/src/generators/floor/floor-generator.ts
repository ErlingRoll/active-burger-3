import { FloorDao } from "../../database/floor-dao.js"
import { Floor } from "../../models/floor.js"
import { Run } from "../../models/run.js"
import { User } from "../../models/user.js"
import { TileGenerator } from "../tile/tile-generator.js"

export class FloorGenerator {
    static DEFAULT_FLOOR_WIDTH = 5
    static DEFAULT_FLOOR_HEIGHT = 5

    static async generateFloor({ user, run }: { user: User; run: Run }): Promise<Floor> {
        const currentFloorNumber = run.floors.length - 1
        const newFloorNumber = currentFloorNumber + 1

        const floorSchema = await FloorDao.createFloor({
            run_id: run.id,
            number: newFloorNumber,
        })

        const floor = Floor.createFromSchema(floorSchema!)

        floor.tiles = await TileGenerator.generateTiles({ user, run, floor })

        return floor
    }
}
