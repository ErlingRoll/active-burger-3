import { RunDao } from "../database/run-dao.js"
import { BaseSchema, RunSchema } from "../database/types/schemas.js"
import { FloorGenerator } from "../generators/floor/floor-generator.js"
import { GameEvent } from "../hub/types.js"
import { gamesync, hub } from "../index.js"
import { ClassProps } from "../utils/type-utils.js"
import { Floor } from "./floor.js"
import { TileObject } from "./tile-object.js"
import { Tile } from "./tile.js"
import { User } from "./user.js"

// Gold standard
export class Run implements BaseSchema, RunSchema {
    id: string
    created_at: string
    user_id: string
    active: boolean
    party_hp: number
    party_max_hp: number
    party_hp_regen: number
    party_mana: number
    party_max_mana: number
    party_mana_regen: number
    party_damage: number
    mods: Record<string, any>
    gold: number
    essence: number

    floors: Record<number, Floor> = {}

    constructor(run: ClassProps<Run>) {
        this.id = run.id
        this.created_at = run.created_at
        this.user_id = run.user_id
        this.active = run.active
        this.party_hp = run.party_hp
        this.party_max_hp = run.party_max_hp
        this.party_hp_regen = run.party_hp_regen
        this.party_mana = run.party_mana
        this.party_max_mana = run.party_max_mana
        this.party_mana_regen = run.party_mana_regen
        this.party_damage = run.party_damage
        this.mods = run.mods
        this.gold = run.gold
        this.essence = run.essence
        this.floors = run.floors || []
    }

    async sync(): Promise<void> {
        await RunDao.updateRun(this)
    }

    async end(user: User): Promise<void> {
        this.active = false
        await user.addEssence(this.essence)
        gamesync.markDirty(this)
    }

    async exitFloor(): Promise<void> {
        const user = hub.getUserByUserId(this.user_id)
        if (!user) {
            throw new Error(`Cannot exit floor: user with ID ${this.user_id} not found in hub`)
        }
        const newFloor = await FloorGenerator.generateFloor({ user: user, run: this })
        this.floors[newFloor.number] = newFloor
        await this.sync()
    }

    getFloor(number: number): Floor | null {
        return this.floors[number] || null
    }

    getTile(floorNumber: number, x: number, y: number): Tile | null {
        const floor = this.getFloor(floorNumber)
        if (!floor) return null
        return floor.getTile(x, y)
    }

    getTileObject(floorNumber: number, x: number, y: number): TileObject | null {
        const tile = this.getTile(floorNumber, x, y)
        if (!tile) return null
        return tile.tile_object
    }

    getStats(): Omit<Run, "floors"> {
        return { ...structuredClone(this), floors: undefined }
    }

    async takeDamage(damage: number): Promise<void> {
        if (this.party_hp <= 0) {
            await this.onDeath()
        } else {
            await this.sync()
            hub.sendToUser(this.user_id, {
                event: GameEvent.RUN_STATS_UPDATED,
                payload: {
                    run_stats: this.getStats(),
                },
            })
        }
    }

    async onDeath(): Promise<void> {}
}
