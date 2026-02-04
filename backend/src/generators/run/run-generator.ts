import { RunDao } from "../../database/run-dao.js"
import { RunSchema } from "../../database/types/schemas.js"
import { Run } from "../../models/run.js"
import { User } from "../../models/user.js"
import { FloorGenerator } from "../floor/floor-generator.js"

export class RunGenerator {
    static async startRun(user: User): Promise<Run> {
        const runSchema = await new RunGenerator().generateRun(user)
        const run = Run.createFromSchema(runSchema)

        const firstFloor = await FloorGenerator.generateFloor({ user, run })
        run.floors.push(firstFloor)

        return run
    }

    async generateRun(user: User): Promise<RunSchema> {
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

        return await RunDao.createRun(run)
    }
}
