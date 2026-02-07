import { GameEvent } from "../hub/types.js"
import { hub } from "../index.js"
import { Run } from "./run.js"
import { TileObject } from "./tile-object.js"
import { User } from "./user.js"

export class Exit extends TileObject {
    constructor(exit: any) {
        super(exit)
    }

    static fromModel(exit: Exit): Exit {
        return new Exit(exit)
    }

    async activate({ user, activeRun }: { user: User; activeRun: Run }): Promise<void> {
        await activeRun.exitFloor()
        hub.sendToUser(user.id, {
            event: GameEvent.RUN_UPDATED,
            payload: {
                run: activeRun,
            },
        })
    }
}
