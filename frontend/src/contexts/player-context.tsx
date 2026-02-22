import { createContext, useContext } from "react"
import GameActions from "./game-actions"

type PlayerContextType = {
    gameActions?: GameActions
    selectedCell?: { x: number; y: number } | null
    setSelectedCell?: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>
}

export const PlayerContext = createContext<PlayerContextType | null>(null)

export const usePlayer = () => {
    const context = useContext(PlayerContext)
    if (!context) {
        throw new Error("usePlayer must be used within a PlayerProvider")
    }
    return context
}
