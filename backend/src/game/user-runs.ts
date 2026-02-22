import { RunDao } from "../database/run-dao.js"
import { Run } from "../models/run.js"

export class UserRuns {
    private userId: string
    private runs: Run[] | null = null
    private dirtyRuns: Run[] = []

    constructor(userId: string) {
        this.userId = userId
    }

    async getRuns(): Promise<Run[] | null> {
        if (this.runs == null) {
            this.runs = await RunDao.getRunsByUserId(this.userId)
        }
        return this.runs
    }

    async getActiveRun(): Promise<Run | null> {
        const runs = await this.getRuns()
        if (!runs) return null
        const activeRuns = runs.filter((run) => run.active)
        if (activeRuns.length > 2) {
            console.warn(`User ${this.userId} has ${activeRuns.length} active runs! This should never happen.`)
        }
        return activeRuns.length > 0 ? (activeRuns[0] as Run) : null
    }
}
