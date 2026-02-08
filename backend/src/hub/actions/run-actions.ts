import { TileDao } from "../../database/tile-dao.js"
import { OptionGenerator } from "../../generators/run/option-generator.js"
import { RunGenerator } from "../../generators/run/run-generator.js"
import { hub } from "../../index.js"
import { RunOption } from "../../models/run-choice/run-option.js"
import { Run } from "../../models/run.js"
import { GameEvent } from "../types.js"

export interface selectedRunChoicePayload {
    tile_id: string
    option: RunOption
}

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

    static async selectRunOption({
        clientId,
        user,
        payload,
    }: {
        clientId: string
        user: any
        payload: selectedRunChoicePayload
    }): Promise<void> {
        const [tile, run] = await Promise.all([TileDao.getTileById(payload.tile_id), Run.loadActiveByUserId(user.id)])

        if (!tile) {
            hub.sendClientError(clientId, `Tile with ID ${payload.tile_id} not found.`)
            return
        }

        if (!run) {
            hub.sendClientError(clientId, `No active run found for user.`)
            return
        }

        const runOption = OptionGenerator.runOptionFromModel(payload.option)
        if (!runOption) {
            hub.sendClientError(clientId, `Invalid run option.`)
            return
        }

        runOption.select?.({ user, run, tile })
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
