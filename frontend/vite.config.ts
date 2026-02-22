import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"

function fullReload() {
    return {
        name: "full-reload",
        handleHotUpdate({ server }: { server: any }) {
            // Trigger a full page reload instead of HMR updates
            server.ws.send({ type: "full-reload" })
            return []
        },
    }
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), fullReload()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3000,
    },
})
