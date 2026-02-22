import { RunDao } from "../../database/run-dao.js"
import { RunSchema } from "../../database/types/schemas.js"
import { Run } from "../../models/run.js"
import { User } from "../../models/user.js"
import { FloorGenerator } from "../floor/floor-generator.js"

export class RunGenerator {
    static async startRun(user: User): Promise<Run | null> {
        const run = await RunGenerator.generateRun(user)
        if (!run) {
            console.error("Failed to generate run for user ID " + user.id)
            return null
        }
        const firstFloor = await FloorGenerator.generateFloor({ user, run })

        run.floors[firstFloor.number] = firstFloor

        return run
    }

    static async generateRun(user: User): Promise<Run | null> {
        const party = user.getParty()
        if (party.length === 0) {
            throw new Error(
                "Cannot start run: user has no characters in their party. This is not supposed to happen :("
            )
        }

        const party_hp = party.reduce((sum, char) => sum + char.hp, 0)
        const party_hp_regen = party.reduce((sum, char) => sum + char.hp_regen, 0)
        const party_mana = party.reduce((sum, char) => sum + char.mana, 0)
        const party_mana_regen = party.reduce((sum, char) => sum + char.mana_regen, 0)
        const party_damage = party.reduce((sum, char) => sum + char.damage, 0)

        if (party_hp <= 0) {
            throw new Error("Cannot start run: party has no HP")
        }

        const run: Partial<RunSchema> = {
            user_id: user.id,
            active: true,
            party_hp,
            party_max_hp: party_hp,
            party_hp_regen,
            party_mana,
            party_max_mana: party_mana,
            party_mana_regen,
            party_damage,
        }

        const newRun = await RunDao.createRun(run)
        if (!newRun) {
            console.error("Failed to create run for user ID " + user.id)
        }
        return newRun
    }
}
