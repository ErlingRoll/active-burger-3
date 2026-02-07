import type WebSocket from "ws"
import { randomUUID } from "node:crypto"
import { ClientConnection } from "./client-connections.js"
import { ClientId, ClientMessage, GameEvent, ServerMessage, UserAction } from "./types.js"
import { User } from "../models/user.js"
import { UserActions } from "./actions/user-actions.js"
import { RunActions } from "./actions/run-actions.js"
import { TileActions } from "./actions/tile-actions.js"

export class GameHub {
    private readonly clientsById = new Map<ClientId, ClientConnection>()
    private readonly idBySocket = new WeakMap<WebSocket, ClientId>()
    private readonly users = new Map<ClientId, User>()

    async addClient(ws: WebSocket): Promise<void> {
        const clientId = randomUUID()
        const conn = new ClientConnection(clientId, ws)

        this.clientsById.set(clientId, conn)
        this.idBySocket.set(ws, clientId)

        // Wire socket events
        ws.on("message", (data) => this.onRawMessage(conn, data))
        ws.on("close", () => this.logoutClient(clientId))
        ws.on("error", () => this.logoutClient(clientId)) // conservative

        // Send welcome with initial state
        conn.send({
            event: GameEvent.LOG,
            payload: {},
            log: [`Welcome, your client ID is ${clientId}`],
        })
    }

    addUser(clientId: ClientId, user: User): void {
        this.users.set(clientId, user)
    }

    getUserByUserId(userId: string): User | null {
        for (const user of this.users.values()) {
            if (user.id === userId) {
                return user
            }
        }
        return null
    }

    getUserByClientId(clientId: ClientId): User {
        return this.users.get(clientId)!
    }

    getClientIdByUserId(userId: string): ClientId | null {
        for (const [clientId, user] of this.users.entries()) {
            if (user.id === userId) {
                return clientId
            }
        }
        return null
    }

    logoutClient(clientId: ClientId): void {
        this.users.delete(clientId)
        const conn = this.clientsById.get(clientId)
        if (!conn) return
        this.idBySocket.delete(conn.ws)
        this.clientsById.delete(clientId)
    }

    /** Broadcast a server message to all connected clients */
    broadcast(msg: ServerMessage): void {
        for (const conn of this.clientsById.values()) {
            conn.send(msg)
        }
    }

    /** Send a server message to one client */
    sendToClient(clientId: ClientId, msg: ServerMessage): boolean {
        const conn = this.clientsById.get(clientId)
        if (!conn) return false
        return conn.send(msg)
    }

    sendToUser(userId: string, msg: ServerMessage): boolean {
        const clientId = this.getClientIdByUserId(userId)
        if (!clientId) return false
        const conn = this.clientsById.get(clientId)
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
        for (const [id, conn] of this.clientsById.entries()) {
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

    /** Mark client alive on pong */
    handlePong(ws: WebSocket): void {
        const id = this.idBySocket.get(ws)
        if (!id) return
        const conn = this.clientsById.get(id)
        if (conn) conn.isAlive = true
    }

    private onRawMessage(conn: ClientConnection, data: WebSocket.RawData): void {
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

        this.route(conn.id, parsedJson)
    }

    private route(clientId: ClientId, msg: ClientMessage): void {
        const action = msg.action as UserAction
        const payload = msg.payload ?? ({} as any)
        const user = this.getUserByClientId(clientId)

        switch (action) {
            case UserAction.LOGIN:
                UserActions.handleLogin({ clientId, payload })
                return

            case UserAction.START_RUN:
                RunActions.startRun({ clientId, payload })
                return

            case UserAction.END_RUN:
                RunActions.endRun({ clientId, payload })
                return

            case UserAction.ACTIVATE_TILE:
                TileActions.activateTile({ clientId, user, payload })
                return

            default:
                this.sendToClient(clientId, {
                    event: GameEvent.LOG_USER_ERROR,
                    payload: { message: `Unknown action: ${action}` },
                })
                return
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
