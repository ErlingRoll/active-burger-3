import { createContext, useContext, useEffect, useRef, useState } from "react"
import { RenderObject } from "../models/object"
import { UIContext } from "./ui-context"
import GameActions from "./game-actions"
import { UserContext } from "./user-context"
import { GamestateContext } from "./gamestate-context"
import { CharacterContext } from "./character-context"
import { Realm } from "../game/world"
import { SettingsContext } from "./settings-context"

type PlayerContextType = {
    gameActions?: GameActions
    localInteract: (object: RenderObject) => void
    selectedCell?: { x: number; y: number } | null
    setSelectedCell?: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>
}

export const PlayerContext = createContext<PlayerContextType>({
    gameActions: null,
    localInteract: (object: RenderObject) => {},
    selectedCell: null,
    setSelectedCell: (cell: { x: number; y: number }) => {},
})

export const PlayerProvider = ({ children }: { children: any }) => {
    const { character } = useContext(CharacterContext)
    const { user, gameCon, gamestate, terrain, reconnect, realm } = useContext(GamestateContext)
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

    function localInteract(object: RenderObject) {
        switch (object.object_id) {
            case "crafting_bench":
                setCraftingBenchOpen(true)
                break
            case "shopkeeper":
                setShopOpen(true)
                break
        }
    }

    function getSelectedCell() {
        if (!character || !gamestate || !gamestate.render_objects) return
        const x = character.x
        const y = character.y

        const newPosMap = {
            up: { x: x, y: y + 1 },
            down: { x: x, y: y - 1 },
            left: { x: x - 1, y: y },
            right: { x: x + 1, y: y },
        }

        const newPos = newPosMap[character.direction]
        setSelectedCell(newPos)
    }

    function checkSolidTile({ x, y, realm }: { x: number; y: number; realm: Realm }) {
        const posKey = x + "_" + y
        let solid = false

        const terrains = terrain[posKey] || []
        for (const t of terrains) {
            if (t.solid && t.realm === realm) {
                solid = true
                break
            }
        }

        const objects = gamestate.position_objects[posKey] || []
        for (const o of objects) {
            if (o.solid && o.realm === realm) {
                solid = true
                break
            }
        }

        return solid
    }

    useEffect(() => {
        getSelectedCell()
    }, [character])

    useEffect(() => {
        gameActions.current.user = user
        gameActions.current.gameCon = gameCon
    }, [user, character, gameCon])

    return (
        <PlayerContext.Provider
            value={{ gameActions: gameActions.current, localInteract, selectedCell, setSelectedCell }}
        >
            {children}
        </PlayerContext.Provider>
    )
}
