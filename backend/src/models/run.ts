import { RunDao } from "../database/run-dao.js"
import { BaseSchema, RunSchema } from "../database/types/schemas.js"
import { FloorGenerator } from "../generators/floor/floor-generator.js"
import { hub } from "../index.js"
import { Floor } from "./floor.js"
import { User } from "./user.js"

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

    floors: Floor[] = []

    constructor(run: Run) {
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

    static async loadActiveByUserId(userId: string): Promise<Run | null> {
        return await RunDao.getActiveRunByUserId(userId)
    }

    static createFromSchema(schema: RunSchema): Run {
        return new Run(schema as Run)
    }

    async end(): Promise<void> {
        this.active = false
        await this.sync()
    }

    async exitFloor(): Promise<void> {
        const user = hub.getUserByUserId(this.user_id)
        if (!user) {
            throw new Error(`Cannot exit floor: user with ID ${this.user_id} not found in hub`)
        }
        const newFloor = FloorGenerator.generateFloor({ user: user, run: this })
        this.floors.push(await newFloor)
        await this.sync()
    }
}
