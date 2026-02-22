import { TileObjectDao } from "../../database/tile-object-dao.js"
import { MonsterSchema } from "../../database/types/schemas.js"
import { Dice } from "../../game/dice.js"
import { TileObjectType } from "../../models/constants.js"
import { Monster } from "../../models/monster.js"
import { Tile } from "../../models/tile.js"
import { defaultMonsterRarityTable, MonsterName, monsters } from "./menagerie.js"

export class MonsterGenerator {
    static async generateMonster({
        tile,
        monsterRarityTable = defaultMonsterRarityTable,
        overrides = {},
    }: {
        tile: Tile
        monsterRarityTable?: { [key: string]: number }
        overrides?: Partial<MonsterSchema>
    }): Promise<Monster | null> {
        const monsterSchema = await this.generateMonsterSchema({ tile, monsterRarityTable, overrides })
        const monsterObject = (await TileObjectDao.createTileObject(monsterSchema)) as Monster
        if (!monsterObject) {
            console.error("Failed to create monster tile object for tile at", tile.x, tile.y)
            return null
        }
        monsterObject.tile = tile
        return monsterObject
    }

    static async generateMonsterSchema({
        tile,
        monsterRarityTable = defaultMonsterRarityTable,
        overrides = {},
    }: {
        tile: Tile
        monsterRarityTable?: { [key: string]: number }
        overrides?: Partial<MonsterSchema>
    }): Promise<MonsterSchema> {
        const monsterName = Dice.pickWeighted({ table: monsterRarityTable, defaultValue: MonsterName.KARATE_PANDA })

        let baseMonster = monsters[monsterName.toLowerCase()]
        if (!baseMonster) {
            throw new Error(`Monster template not found for name: ${monsterName}`)
        }

        let monsterSchema: MonsterSchema | any = {
            tile_id: tile.id,
            name: baseMonster.name,
            tile_object_type: TileObjectType.MONSTER,
            rarity: baseMonster.rarity,
            texture: baseMonster.texture,
            game_id: baseMonster.game_id,
            max_hp: baseMonster.max_hp,
            hp: baseMonster.max_hp,
            damage: baseMonster.damage,
            ...overrides,
        }

        return monsterSchema
    }
}
