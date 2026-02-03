import { WebSocketServer } from "ws"
import { GameHub } from "./hub/game-hub.js"
import { createClient } from "@supabase/supabase-js"
import { Database } from "./database/types/database.js"
import "dotenv/config"

const PORT = Number(process.env.PORT ?? 8080)
const PATH = "/game"

const wss = new WebSocketServer({
    port: PORT,
    path: PATH,
    // You can set perMessageDeflate: false for lower CPU and more predictable latency
    perMessageDeflate: false,
})

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Missing Supabase configuration in environment variables")
}

export const database = createClient<Database>(SUPABASE_URL, SUPABASE_KEY)

export const hub = new GameHub()

wss.on("connection", async (ws) => {
    await hub.addClient(ws)

    ws.on("pong", () => hub.handlePong(ws))
})

const HEARTBEAT_MS = 30_000
setInterval(() => hub.heartbeat(), HEARTBEAT_MS)

console.log(`WebSocket server listening on ws://localhost:${PORT}`)
