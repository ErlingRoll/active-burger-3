import { Run } from "../models/run.js"
import { UserRuns } from "./user-runs.js"

export class Gamestate {
    private userRuns: Map<string, UserRuns> = new Map()

    async getActiveRunByUserId(userId: string): Promise<Run | null> {
        if (!this.userRuns.has(userId)) {
            this.userRuns.set(userId, new UserRuns(userId))
        }
        const runs = this.userRuns.get(userId)
        return (await runs?.getActiveRun()) || null
    }
}
