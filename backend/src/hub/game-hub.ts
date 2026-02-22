import type WebSocket from "ws"
import { randomUUID } from "node:crypto"
import { ClientConnection } from "./client-connections.js"
import { ClientId, ClientMessage, GameEvent, ServerMessage, UserAction, UserId } from "./types.js"
import { User } from "../models/user.js"
import { UserActions } from "./actions/user-actions.js"
import { RunActions } from "./actions/run-actions.js"
import { TileActions } from "./actions/tile-actions.js"
import { ItemActions } from "./actions/item-actions.js"
import { gamestate } from "../index.js"

export class GameHub {
    private readonly clientIdConnectionMap = new Map<ClientId, ClientConnection>()
    private readonly userClientMap = new Map<UserId, ClientId>()

    async addClient(ws: WebSocket): Promise<void> {
        const clientId = randomUUID()
        const conn = new ClientConnection(clientId, ws)

        this.clientIdConnectionMap.set(clientId, conn)

        // Wire socket events
        ws.on("message", (data) => this.onRawMessage(conn, data))
        ws.on("close", () => this.logoutClient(clientId))
        ws.on("error", () => this.logoutClient(clientId))

        // Send welcome with initial state
        conn.send({
            event: GameEvent.LOG,
            payload: {},
            log: [`Welcome, your client ID is ${clientId}`],
        })
    }

    addUser(clientId: ClientId, userId: UserId): void {
        for (const [existingId, existingConnection] of this.clientIdConnectionMap.entries()) {
            if (userId === existingConnection.userId) {
                // console.log(
                //     `User ${userId} is already logged in on client ${existingId}, moving to new client ${clientId}`
                // )
                // Remove the old client connection
                this.clientIdConnectionMap.delete(existingId)
                // Remove the old user-client mapping
                this.userClientMap.delete(userId)

                // Create a new client connection for the same user
                this.clientIdConnectionMap.set(clientId, existingConnection)
                return
            }
        }

        const conn = this.clientIdConnectionMap.get(clientId)
        if (!conn) {
            // console.error(`Trying to add user ${userId} to non-existent client ${clientId}`)
            return
        }
        conn.userId = userId
        this.userClientMap.set(userId, clientId)
        console.log(`Total clients: ${this.clientIdConnectionMap.size}, total users: ${this.userClientMap.size}`)
    }

    getClientIdByUserId(userId: string): ClientId | null {
        return this.userClientMap.get(userId) ?? null
    }

    logoutClient(clientId: ClientId): void {
        this.userClientMap.delete(clientId)
        const conn = this.clientIdConnectionMap.get(clientId)
        if (!conn) return
        this.clientIdConnectionMap.delete(clientId)
    }

    /** Broadcast a server message to all connected clients */
    broadcast(msg: ServerMessage): void {
        for (const conn of this.clientIdConnectionMap.values()) {
            conn.send(msg)
        }
    }

    /** Send a server message to one client */
    sendToClient(clientId: ClientId, msg: ServerMessage): boolean {
        const conn = this.clientIdConnectionMap.get(clientId)
        if (!conn) return false
        return conn.send(msg)
    }

    sendToUser(userId: string, msg: ServerMessage): boolean {
        const clientId = this.getClientIdByUserId(userId)
        if (!clientId) return false
        const conn = this.clientIdConnectionMap.get(clientId)
        if (!conn) return false
        return conn.send(msg)
    }

    sendClientError(clientId: ClientId, message: string): void {
        {
            this.sendToClient(clientId, { event: GameEvent.LOG_USER_ERROR, payload: { message } })
        }
    }

    sendUserError(userId: string, message: string): void {
        const clientId = this.getClientIdByUserId(userId)
        if (!clientId) return
        this.sendToClient(clientId, { event: GameEvent.LOG_USER_ERROR, payload: { message } })
    }

    /** Heartbeat: ping all clients, and drop dead ones */
    heartbeat(): void {
        for (const [id, conn] of this.clientIdConnectionMap.entries()) {
            if (!conn.isAlive) {
                conn.close(1001, "heartbeat timeout")
                this.logoutClient(id)
                continue
            }
            conn.isAlive = false
            try {
                conn.ws.ping()
            } catch {
                conn.close(1001, "ping failed")
                this.logoutClient(id)
            }
        }
    }

    private async onRawMessage(conn: ClientConnection, data: WebSocket.RawData): Promise<void> {
        conn.isAlive = true

        // Rate-limit by message
        if (!conn.limiter.allow(1)) {
            conn.send({ event: GameEvent.LOG_USER_ERROR, payload: { message: "Too many messages" } })
            return
        }

        const text = this.rawToString(data)
        if (text == null) {
            conn.send({ event: GameEvent.LOG_USER_ERROR, payload: { message: "Message must be text" } })
            return
        }

        let parsedJson: ClientMessage
        try {
            parsedJson = JSON.parse(text)
        } catch {
            conn.send({ event: GameEvent.LOG_USER_ERROR, payload: { message: "Invalid JSON" } })
            return
        }

        // const parsed = ClientMsgSchema.safeParse(parsedJson);
        // if (!parsed.success) {
        //   conn.send({ t: "error", code: "BAD_MSG", message: "Invalid message shape" });
        //   return;
        // }

        await this.route(conn.id, parsedJson)
    }

    private async route(clientId: ClientId, msg: ClientMessage): Promise<void> {
        const action = msg.action as UserAction
        const payload = msg.payload ?? ({} as any)
        const user = await gamestate.getUserById(this.clientIdConnectionMap.get(clientId)?.userId ?? "")

        // console.log(`Received action ${action} from client ${clientId} (user ${user?.id ?? "none"})`)

        switch (action) {
            case UserAction.LOGIN:
                UserActions.handleLogin({ clientId, payload })
                break

            case UserAction.START_RUN:
                RunActions.startRun({ clientId, user, payload })
                break

            case UserAction.END_RUN:
                RunActions.endRun({ clientId, user, payload })
                break

            case UserAction.ACTIVATE_TILE:
                TileActions.activateTile({ clientId, user, payload })
                break

            case UserAction.SELECT_RUN_OPTION:
                RunActions.selectRunOption({ clientId, user, payload })
                break

            case UserAction.USE_ITEM:
                ItemActions.useItem({ clientId, user, payload })
                break

            default:
                console.error(`Unknown action: ${action}`)
                this.sendToClient(clientId, {
                    event: GameEvent.LOG_USER_ERROR,
                    payload: { message: `Unknown action: ${action}` },
                })
        }
    }

    private rawToString(data: WebSocket.RawData): string | null {
        if (typeof data === "string") return data
        if (data instanceof Buffer) return data.toString("utf8")
        // ArrayBuffer / Uint8Array cases:
        if (Array.isArray(data)) return Buffer.concat(data).toString("utf8")
        if (data instanceof ArrayBuffer) return Buffer.from(data).toString("utf8")
        if (ArrayBuffer.isView(data)) return Buffer.from(data.buffer).toString("utf8")
        return null
    }
}
