import { CharactersContext } from "@/contexts/characters-context"
import { HitResult, ChatMessage, gameWebsocketUrl, GamestateContext } from "@/contexts/gamestate-context"
import { GameEvent } from "@/contexts/server-types"
import { UserContext } from "@/contexts/user-context"
import { RunChoice, Run, Floor, Tile, User, Item } from "@/game/objects"
import { Realm, RealmSettings, realmBackground } from "@/game/world"
import { textures } from "@/main"
import React, { useState, useContext, useEffect } from "react"
import { toast } from "react-toastify"

export const GamestateProvider = ({ children }: { children: any }) => {
    const [gameCon, setGameCon] = useState<WebSocket | null>(null)
    const [realm, setRealm] = useState<Realm | null>(null)
    const [realmSettings, setRealmSettings] = useState<RealmSettings>({
        background: "terrain/grass/grass",
    })
    const [log, setLog] = useState<string[]>([])
    const [damageHits, setDamageHits] = useState<HitResult[]>([])
    const [partyDamageHits, setPartyDamageHits] = useState<HitResult[]>([])
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

    const [connecting, setConnecting] = useState<boolean>(false)
    const [connectTimeout, setConnectTimeout] = useState(null)

    const { externalUser, setExternalUser } = useContext(UserContext)
    const { characters, setCharacters, updateCharacter } = useContext(CharactersContext)
    const [user, setUser] = React.useState<User | null>(null)
    const [items, setItems] = useState<Item[]>([])

    const [runChoices, setRunChoices] = React.useState<RunChoice[]>([]) // Stack of run choices, newest first

    // Run state
    const [run, setRun] = React.useState<Run | null>(null)
    const [runStats, setRunStats] = React.useState<Omit<Run, "floors"> | null>(null)
    const [floors, setFloors] = React.useState<{ [key: string]: Floor }>({})

    useEffect(() => {
        if (!realm) return
        const newSettings: RealmSettings = {
            background: realmBackground[realm] || "terrain/grass/grass",
        }
        setRealmSettings(newSettings)
    }, [realm])

    function logout() {
        // Remove user data from localStorage
        localStorage.removeItem("discordUser")
        localStorage.removeItem("discordAccessToken")
        localStorage.removeItem("discordRefreshToken")

        // Close websocket connection
        if (gameCon) {
            gameCon.close()
            setGameCon(null)
        }
        setCharacters(null)
        setUser(null)
        setExternalUser(null)
    }

    function notifyLoot(payload: any) {
        const items: Item[] = payload.items
        const toast_component = (
            <div className="flex flex-col items-start gap-1">
                <p className="font-bold mb-1">Looted!</p>
                {items.map((item, index: number) => (
                    <div key={index} className="flex items-center">
                        <p className="mr-2">
                            <b>{item.count}</b>x
                        </p>
                        <div className="h-8 w-8 center-col mr-1">
                            <img
                                src={textures[`/src/assets/textures/${item.texture}.webp`]}
                                className="h-full object-fit"
                            />
                        </div>
                        <span className={`font-bold text-${item.rarity}`}>{item.name}</span>
                    </div>
                ))}
            </div>
        )
        toast(toast_component)
    }

    function on_event(event: string, payload: any, log: string[] | null) {
        if (log) setLog((prevLog) => [...log, ...prevLog])

        console.debug("Received event:", event, payload)

        switch (event) {
            case GameEvent.LOGIN_SUCCESS:
                on_login_success(payload)
                break
            case GameEvent.USER_UPDATED:
                setUser(payload.user)
                break
            case GameEvent.RUN_UPDATED:
                setRun(payload.run)
                break
            case GameEvent.RUN_STATS_UPDATED:
                setRunStats((prev) => ({ ...prev, ...payload.run_stats }))
                break
            case GameEvent.RUN_ENDED:
                setRun(null)
                break
            case GameEvent.RUN_CHOICE:
                setRunChoices((prev) => [payload.runChoice, ...prev])
                break
            case GameEvent.TILE_UPDATED:
                updateTile(payload.tile)
                break
            case GameEvent.LOOT_DROPPED:
                notifyLoot(payload)
                break
            case GameEvent.ITEMS_UPDATED:
                setItems(payload.items)
                break
            case GameEvent.CHARACTER_UPDATED:
                const updatedCharacter = payload.character
                updateCharacter(updatedCharacter)
                break
            case GameEvent.MONSTER_DAMAGED:
                let _damageHits = damageHits.slice(0, 100)
                setDamageHits([payload, ..._damageHits])
                break
            case GameEvent.PARTY_DAMAGED:
                console.log("Received PARTY_DAMAGED event with hits:", payload.hit_results)
                setPartyDamageHits(payload.hit_results)
                break

            // Logging events
            case GameEvent.LOG_USER_ERROR:
                toast.error(payload.message)
                break
            case GameEvent.LOG:
                break
            default:
                console.error("Unhandled WebSocket event:", event, payload, log)
        }
    }

    function updateTile(updatedTile: Tile) {
        setRun((prevRun) => {
            if (!prevRun) return prevRun
            const newRun = { ...prevRun }
            const floorIndex = Object.keys(newRun.floors).length - 1
            const floor = newRun.floors[floorIndex]
            floor.tiles[`${updatedTile.x}_${updatedTile.y}`] = updatedTile
            return newRun
        })
    }

    function on_login_success(data: { user: User; run: Run }) {
        const user = data.user
        const run = data.run
        setCharacters(user.characters)
        setRun(run)
        setUser(user)
    }

    useEffect(() => {
        if (!gameCon) return
        gameCon.onmessage = (event: any) => {
            const data = event.data
            let parsedData = null
            try {
                parsedData = JSON.parse(data)
            } catch (e) {
                console.error("Error parsing WebSocket message:", data)
                return
            }
            const messageEvent = parsedData.event
            if (!messageEvent) {
                console.error("Received WebSocket message without event:", parsedData)
                return
            }

            // Handle events
            on_event(messageEvent, parsedData.payload, parsedData.log)
        }
    }, [gameCon])

    function tryLogin() {
        const loginInfo = {
            action: "login",
            payload: {
                discord_id: externalUser?.id,
                discord_avatar: externalUser?.avatar,
                name: externalUser?.global_name,
            },
        }

        gameCon.send(JSON.stringify(loginInfo))
    }

    useEffect(() => {
        if (!gameCon) return
        gameCon.onerror = (error) => {
            console.error("WebSocket error:", error)
            gameCon.close()
            setGameCon(null)
        }

        gameCon.onmessage = (event: any) => {
            const data = event.data
            let parsedData = null
            try {
                parsedData = JSON.parse(data)
            } catch (e) {
                console.error("Error parsing WebSocket message:", data)
                return
            }
            const messageEvent = parsedData.event
            if (!messageEvent) {
                console.error("Received WebSocket message without event:", parsedData)
                return
            }

            // Handle events
            on_event(messageEvent, parsedData.payload, parsedData.log)
        }

        tryLogin()
    }, [gameCon, connecting])

    function connect() {
        console.log("Connecting to WebSocket at", gameWebsocketUrl)

        // Stop if already connected
        if (gameCon) {
            console.log("WebSocket already connected")
            return
        }

        const ws = new WebSocket(gameWebsocketUrl)
        ws.onopen = () => {
            console.log("WebSocket connection established")
            setGameCon(ws)
        }

        ws.onclose = () => {
            console.log("WebSocket connection closed")
            setGameCon(null)
            setExternalUser(null)
        }
    }

    useEffect(() => {
        if (!externalUser) return
        connect()
    }, [externalUser])

    return (
        <GamestateContext.Provider
            value={{
                gameCon,
                setGameCon,
                reconnect: connect,
                logout,
                log,
                damageHits,
                partyDamageHits,
                chatMessages,
                realm,
                setRealm,
                realmSettings,
                user,
                setUser,
                items,
                setItems,
                run,
                setRun,
                floors,
                setFloors,
                runStats,
                setRunStats,
                runChoices,
                setRunChoices,
            }}
        >
            {children}
        </GamestateContext.Provider>
    )
}
