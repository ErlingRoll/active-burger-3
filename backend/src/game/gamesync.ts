import { Run } from "../models/run.js"
import { TileObject } from "../models/tile-object.js"
import { Tile } from "../models/tile.js"
import { User } from "../models/user.js"

export class Gamesync {
    private SYNC_INTERVAL_MS = 3000
    private syncInterval: NodeJS.Timeout | null = null
    private busySyncing = false

    private dirtyUsers: Set<User> = new Set()
    private dirtyRuns: Set<Run> = new Set()
    private dirtyTiles: Set<Tile> = new Set()
    private dirtyTileObjects: Set<TileObject> = new Set()

    constructor() {
        this.startSync()
    }

    startSync(): void {
        if (this.syncInterval) return
        this.syncInterval = setInterval(() => this.sync(), this.SYNC_INTERVAL_MS)
    }

    private async sync(): Promise<void> {
        if (this.busySyncing) return
        this.busySyncing = true
        // console.log(`Syncing gamestate at ${new Date().toISOString()}`)

        const userUpdates: Promise<void>[] = []
        const runUpdates: Promise<void>[] = []
        const tileUpdates: Promise<void>[] = []
        const tileObjectUpdates: Promise<void>[] = []

        this.syncDirty(this.dirtyUsers, userUpdates)
        this.syncDirty(this.dirtyRuns, runUpdates)
        this.syncDirty(this.dirtyTiles, tileUpdates)
        this.syncDirty(this.dirtyTileObjects, tileObjectUpdates)

        await Promise.all([...userUpdates, ...runUpdates, ...tileUpdates, ...tileObjectUpdates])

        if (userUpdates.length + runUpdates.length + tileUpdates.length + tileObjectUpdates.length > 0) {
            console.log(
                `Synced: ${runUpdates.length} runs, ${tileUpdates.length} tiles, ${tileObjectUpdates.length} tile objects`
            )
        }
        this.busySyncing = false
    }

    private syncDirty(dirtySet: Set<any>, updates: Promise<void>[]): void {
        for (const entity of dirtySet) {
            updates.push(entity.sync())
        }
        dirtySet.clear()
    }

    markDirty(object: User | Run | Tile | TileObject): void {
        switch (true) {
            case object instanceof User:
                this.dirtyUsers.add(object as User)
                break
            case object instanceof Run:
                this.dirtyRuns.add(object as Run)
                break
            case object instanceof Tile:
                this.dirtyTiles.add(object as Tile)
                break
            case object instanceof TileObject:
                this.dirtyTileObjects.add(object as TileObject)
                break
            default:
                console.warn(`Unknown object type marked dirty: ${object}`)
        }
    }
}
