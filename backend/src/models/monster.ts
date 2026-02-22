import { TileDao } from "../database/tile-dao.js"
import { Dice } from "../game/dice.js"
import { GameEvent, HitResult } from "../hub/types.js"
import { gamesync, hub } from "../index.js"
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
            hub.sendToUser(user.id, {
                event: GameEvent.TILE_UPDATED,
                payload: {
                    tile: this.tile,
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

            activeRun.takeDamage(monsterDamage)
        }
    }

    async onDeath({ user, activeRun }: { user: User; activeRun: Run }): Promise<void> {
        this.deleted = true
        gamesync.markDirty(this)
        this.tile.deleteTileObject()
        hub.sendToUser(user.id, {
            event: GameEvent.TILE_UPDATED,
            payload: {
                tile: this.tile,
            },
        })
    }
}
