import { RunDao } from "../../database/run-dao.js"
import { RunSchema } from "../../database/types/schemas.js"
import { hub } from "../../index.js"
import { Run } from "../../models/run.js"
import { User } from "../../models/user.js"

export class RunGenerator {
    static async startRun(user: User): Promise<Run> {
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
            party_hp_regen,
            party_mana,
            party_mana_regen,
            party_damage,
        }

        const runSchema = await RunDao.createRun(run)
        return Run.createFromSchema(runSchema!)
    }
}
