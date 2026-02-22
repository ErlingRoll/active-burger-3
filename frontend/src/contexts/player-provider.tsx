import { useContext, useEffect, useRef, useState } from "react"
import { UIContext } from "./ui-context"
import GameActions from "./game-actions"
import { CharactersContext } from "./characters-context"
import { SettingsContext } from "./settings-context"
import { useGamestate } from "@/contexts/gamestate-context"
import { PlayerContext } from "@/contexts/player-context"

export const PlayerProvider = ({ children }: { children: any }) => {
    const { characters: character } = useContext(CharactersContext)
    const { user, gameCon, reconnect, realm } = useGamestate()
    const { shopOpen, setShopOpen, craftingBenchOpen, setCraftingBenchOpen } = useContext(UIContext)
    const { settings } = useContext(SettingsContext)

    const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null)

    const [lastAction, setLastAction] = useState<{ action: string; timestamp: number }>({
        action: "",
        timestamp: Date.now(),
    })
    const [nextActionAllowed, setNextActionAllowed] = useState<number>(Date.now())
    const [lastMoveRepeat, setLastMoveRepeat] = useState<number>(Date.now())
    const moveRepeatDelay = 100 // milliseconds

    // Store gameactions in a ref so it doesn't get recreated on every render
    const gameActions = useRef(new GameActions(reconnect))

    useEffect(() => {
        gameActions.current.user = user
        gameActions.current.gameCon = gameCon
    }, [user, character, gameCon])

    return (
        <PlayerContext.Provider value={{ gameActions: gameActions.current, selectedCell, setSelectedCell }}>
            {children}
        </PlayerContext.Provider>
    )
}
