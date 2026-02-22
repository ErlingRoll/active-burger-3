import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"

export const textures: Record<string, any> = import.meta.glob("/src/assets/textures/**/*", {
    query: "?url",
    import: "default",
    eager: true,
})

const rootEl = document.getElementById("root")!
const root = createRoot(rootEl)
root.render(<App />)
