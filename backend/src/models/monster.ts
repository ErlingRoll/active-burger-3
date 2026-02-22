import { TileDao } from "../database/tile-dao.js"
import { Dice } from "../game/dice.js"
import { GameEvent, HitResult } from "../hub/types.js"
import { hub } from "../index.js"
import { ClassProps } from "../utils/type-utils.js"
import { Run } from "./run.js"
import { TileObject } from "./tile-object.js"
import { User } from "./user.js"

export class Monster extends TileObject {
    constructor(monster: ClassProps<Monster>) {
        super(monster)
    }

    async activate({ user, activeRun }: { user: User; activeRun: Run }): Promise<void> {
        const partyDamage = Dice.roll({ max: activeRun.party_damage })
        if (this.hp == null) {
            return console.error("Monster has no hp:", this)
        }
        this.hp -= partyDamage

        if (this.hp <= 0) {
            await this.onDeath({ user, activeRun })
        } else {
            await this.sync()
            const tile = await TileDao.getTileById(this.tile_id)
            if (!tile) {
                return console.error("Tile not found for monster:", this)
            }

            const updatedTile = { ...tile, tile_object: this }
            hub.sendToUser(user.id, {
                event: GameEvent.TILE_UPDATED,
                payload: {
                    tile: updatedTile,
                },
            })

            hub.sendToUser(user.id, {
                event: GameEvent.MONSTER_DAMAGED,
                payload: {
                    monsterId: this.id,
                    damage: partyDamage,
                    critical: false,
                } as HitResult,
            })

            const monsterDamage = Dice.roll({ max: this.damage || 0 })
            activeRun.party_hp -= monsterDamage

            if (activeRun.party_hp <= 0) {
                await activeRun.onDeath()
            } else {
                await activeRun.sync()
                hub.sendToUser(user.id, {
                    event: GameEvent.RUN_STATS_UPDATED,
                    payload: {
                        run_stats: activeRun.getStats(),
                    },
                })
            }
        }
    }

    async onDeath({ user, activeRun }: { user: User; activeRun: Run }): Promise<void> {
        const tile = await TileDao.getTileById(this.tile_id)
        if (!tile) {
            return console.error("Tile not found for monster onDeath:", this)
        }
        const tilePromises = []

        tilePromises.push(this.delete())

        const updatedTile = { ...tile, tile_object: null }
        tilePromises.push(
            hub.sendToUser(user.id, {
                event: GameEvent.TILE_UPDATED,
                payload: {
                    tile: updatedTile,
                },
            })
        )

        await Promise.all(tilePromises)
    }
}
