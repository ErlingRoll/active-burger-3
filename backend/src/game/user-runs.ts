import { RunDao } from "../database/run-dao.js"
import { Run } from "../models/run.js"

export class UserRuns {
    private userId: string
    private runs: Run[] | null = null

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
        let activeRuns = this.runs?.filter((run) => run.active) || []
        if (activeRuns.length === 0) {
            // If we don't have any active runs in memory, check the database in case we missed an update
            this.runs = await RunDao.getRunsByUserId(this.userId)
        }
        activeRuns = this.runs?.filter((run) => run.active) || []

        if (activeRuns.length > 2) {
            console.warn(`User ${this.userId} has ${activeRuns.length} active runs! This should never happen.`)
        }

        return activeRuns.length > 0 ? (activeRuns[0] as Run) : null
    }
}
