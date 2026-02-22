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
        gamesync.markDirty(this)

        hub.sendToUser(user.id, {
            event: GameEvent.MONSTER_DAMAGED,
            payload: {
                monsterId: this.id,
                tile: this.tile,
                damage: partyDamage,
                critical: false,
            } as HitResult,
        })

        if (this.hp <= 0) {
            await this.onDeath({ user, activeRun })
        } else {
            hub.sendToUser(user.id, {
                event: GameEvent.TILE_UPDATED,
                payload: {
                    tile: this.tile,
                },
            })
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

    rollDamage(): number {
        return Dice.roll({ max: this.damage || 0 })
    }

    attackParty(run: Run): HitResult {
        const monsterDamage = this.rollDamage()
        run.takeDamage(monsterDamage, this)
        return {
            monsterId: this.id,
            tile: this.tile,
            damage: monsterDamage,
            critical: false,
        }
    }

    async playTurn(run: Run): Promise<HitResult> {
        return this.attackParty(run)
    }
}
