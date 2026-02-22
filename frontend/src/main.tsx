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

let mountKey = 0

function render() {
    root.render(<App key={mountKey} />)
}

render()

if (import.meta.hot) {
    import.meta.hot.on("vite:beforeUpdate", () => {
        mountKey += 1 // forces full React remount
        render()
    })
}
