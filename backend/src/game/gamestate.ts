import { UserDao } from "../database/user-dao.js"
import { UserId } from "../hub/types.js"
import { Run } from "../models/run.js"
import { UserRuns } from "./user-runs.js"

export class Gamestate {
    private userRuns: Map<string, UserRuns> = new Map()
    private users: Map<UserId, any> = new Map()

    async getActiveRunByUserId(userId: string): Promise<Run | null> {
        if (!this.userRuns.has(userId)) {
            this.userRuns.set(userId, new UserRuns(userId))
        }
        const runs = this.userRuns.get(userId)
        return (await runs?.getActiveRun()) || null
    }

    async getUserById(userId: UserId): Promise<any> {
        const user = this.users.get(userId)
        if (user) {
            return user
        }

        const dbUser = await UserDao.getUserById({ userId })
        if (dbUser) {
            this.users.set(userId, dbUser)
            return dbUser
        }

        return null
    }
}
