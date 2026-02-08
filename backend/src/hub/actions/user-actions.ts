import { hub } from "../../index.js"
import { Run } from "../../models/run.js"
import { UserService } from "../../services/user-service.js"
import { GameEvent } from "../types.js"

interface LoginPayload {
    discord_id: string
    discord_avatar: string
    name: string
}

export class UserActions {
    static async handleLogin({ clientId, payload }: { clientId: string; payload: LoginPayload }): Promise<void> {
        let user = await UserService.getOrCreateDiscordUser(payload.discord_id, payload.name)
        if (!user) {
            return
        }

        hub.addUser(clientId, user)

        const activeRun: Run | null = await Run.loadActiveByUserId(user.id)

        hub.sendToClient(clientId, {
            event: GameEvent.LOGIN_SUCCESS,
            payload: {
                user: user,
                run: activeRun,
            },
            log: [`Login successful. Welcome, ${user.name}!`],
        })

        if (activeRun) {
            hub.sendToUser(user.id, {
                event: GameEvent.RUN_STATS_UPDATED,
                payload: {
                    run_stats: activeRun.getStats(),
                },
            })
        }
    }
}
