import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"

export const textures: Record<string, any> = import.meta.glob("/src/assets/textures/**/*", {
    query: "?url",
    import: "default",
    eager: true,
})

createRoot(document.getElementById("root")!).render(<App />)
