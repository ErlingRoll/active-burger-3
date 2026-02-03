import type WebSocket from "ws"
import { SimpleRateLimiter } from "./rate-limit.js"
import { ClientId, ServerMessage } from "./types.js"

export class ClientConnection {
    public readonly id: ClientId
    public readonly ws: WebSocket

    // Marked true when we receive pong or any message; used to detect dead peers
    public isAlive = true

    // Basic anti-spam (tune to your liking)
    public readonly limiter = new SimpleRateLimiter(20, 10) // burst 20, refill 10 tokens/sec

    constructor(id: ClientId, ws: WebSocket) {
        this.id = id
        this.ws = ws
    }

    send(msg: ServerMessage): boolean {
        if (this.ws.readyState !== this.ws.OPEN) return false

        // Backpressure guard: if client is slow, avoid unbounded buffering
        // Tune threshold based on your payload sizes. 1MB is a safe-ish starting point.
        const bufferedAmount: number = (this.ws as any).bufferedAmount ?? 0
        if (bufferedAmount > 1_000_000) return false

        this.ws.send(JSON.stringify(msg))
        return true
    }

    close(code = 1000, reason = "bye"): void {
        try {
            this.ws.close(code, reason)
        } catch {
            // ignore
        }
    }
}
