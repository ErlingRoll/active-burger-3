import { Fragment } from "react"
import "./App.css"
import CompoundProvider from "./contexts/compound-provider"

import Game from "./Game"
import Settings from "./views/components/settings"

function App() {
    return (
        <CompoundProvider>
            <div className="text-light">
                <Game />
                <Settings />
                <div className="absolute top-0 left-0 hidden">
                    <p className="bg-common border-common text-common">Common</p>
                    <p className="bg-uncommon border-uncommon text-uncommon">Uncommon</p>
                    <p className="bg-rare border-rare text-rare">Rare</p>
                    <p className="bg-epic border-epic text-epic">Epic</p>
                    <p className="bg-legendary border-legendary text-legendary">Legendary</p>
                </div>
            </div>
        </CompoundProvider>
    )
}

export default App
