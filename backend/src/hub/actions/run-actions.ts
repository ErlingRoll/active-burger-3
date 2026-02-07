import { RunGenerator } from "../../generators/run/run-generator.js"
import { hub } from "../../index.js"
import { Run } from "../../models/run.js"
import { GameEvent } from "../types.js"

export class RunActions {
    static async startRun({ clientId, payload }: { clientId: string; payload: any }): Promise<void> {
        const user = hub.getUserByClientId(clientId)
        const run = await RunGenerator.startRun(user)

        hub.sendToClient(clientId, {
            event: GameEvent.RUN_UPDATED,
            payload: {
                run: run,
            },
        })
    }

    static async endRun({ clientId, payload }: { clientId: string; payload: any }): Promise<void> {
        const user = hub.getUserByClientId(clientId)

        const run = await Run.loadActiveByUserId(user.id)
        if (!run) {
            hub.sendClientError(clientId, `No active run to end.`)
            return
        }

        try {
            await run.end()
            hub.sendToClient(clientId, {
                event: GameEvent.RUN_ENDED,
                payload: {},
            })
        } catch (error: any) {
            hub.sendClientError(clientId, `Failed to end run: ${error.message}`)
        }
    }
}
