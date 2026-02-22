import { Dispatch, SetStateAction, createContext, useContext } from "react"
import { Realm, RealmSettings } from "../game/world"
import { Floor, Item, Run, RunChoice, Tile, User } from "../game/objects"

export type ChatMessage = {
    account_id: string
    account_name: string
    character_id: string
    character_name: string
    message: string
    timestamp: string
}

export const gameWebsocketUrl = import.meta.env.VITE_GAME_WS_URL

export type LocalAction = "open_shop"

export type HitResult = {
    monsterId: string
    tile: Tile
    damage: number
    critical: boolean
}

export type GamestateContextType = {
    gameCon: WebSocket | null
    setGameCon: Dispatch<SetStateAction<any>>
    logout: () => void
    log: string[]
    damageHits: HitResult[]
    partyDamageHits: HitResult[]
    chatMessages: ChatMessage[]
    reconnect: () => void
    realm?: Realm
    setRealm?: Dispatch<SetStateAction<Realm | null>>
    realmSettings?: RealmSettings
    user: User | null
    setUser: Dispatch<SetStateAction<User | null>>
    items: Item[]
    setItems: Dispatch<SetStateAction<Item[]>>
    run: Run | null
    setRun: Dispatch<SetStateAction<Run | null>>
    floors: { [key: string]: Floor }
    setFloors: Dispatch<SetStateAction<{ [key: string]: Floor }>>
    runStats: Omit<Run, "floors"> | null
    setRunStats: Dispatch<SetStateAction<Omit<Run, "floors"> | null>>
    runChoices: RunChoice[]
    setRunChoices: Dispatch<SetStateAction<RunChoice[]>>
}

export const GamestateContext = createContext<GamestateContextType | null>(null)

export function useGamestate() {
    const ctx = useContext(GamestateContext)
    if (!ctx) throw new Error("useGamestate must be used within <GameProvider>")
    return ctx
}
