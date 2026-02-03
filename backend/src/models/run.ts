import { RunDao } from "../database/run-dao.js"
import { RunSchema } from "../database/types/schemas.js"

export class Run implements RunSchema {
    id!: string
    created_at!: string
    user_id!: string
    active!: boolean
    party_hp!: number
    party_hp_regen!: number
    party_mana!: number
    party_mana_regen!: number
    party_damage!: number
    mods!: Record<string, any>

    private constructor(schema: RunSchema) {
        this.id = schema.id
        this.created_at = schema.created_at
        this.user_id = schema.user_id
        this.active = schema.active
        this.party_hp = schema.party_hp
        this.party_hp_regen = schema.party_hp_regen
        this.party_mana = schema.party_mana
        this.party_mana_regen = schema.party_mana_regen
        this.party_damage = schema.party_damage
        this.mods = schema.mods
    }

    async sync(): Promise<Run> {
        const updatedRun = await RunDao.updateRun(this)
        return new Run(updatedRun)
    }

    static async loadActiveByUserId(userId: string): Promise<Run | null> {
        const schema = await RunDao.getActiveRunByUserId(userId)
        if (!schema) return null

        return Run.createFromSchema(schema)
    }

    static createFromSchema(schema: RunSchema): Run {
        return new Run(schema)
    }

    async end(): Promise<void> {
        this.active = false
        await this.sync()
    }
}
