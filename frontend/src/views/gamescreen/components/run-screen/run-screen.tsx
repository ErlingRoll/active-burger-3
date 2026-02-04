import { JSX, useContext, useEffect } from "react"
import { PlayerContext } from "../../../../contexts/player-context"
import { GamestateContext } from "../../../../contexts/gamestate-context"
import { Tile } from "../../../../game/objects"
import { TileType } from "../../../../models/tiles"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const RunScreen = () => {
    const { user, run, setRun } = useContext(GamestateContext)
    const { gameActions } = useContext(PlayerContext)

    useEffect(() => {
        // console.log("Current tiles:", tiles)
    }, [run])

    const partyLeader = user.characters[0]

    function endRun() {
        gameActions.endRun()
    }

    function activeTile(tile: Tile): void {
        if (!tile) return

        if (tile.hidden) {
            setRun((prevRun) => {
                if (!prevRun) return prevRun
                const newRun = { ...prevRun }
                const floorIndex = newRun.floors.length - 1
                const floor = newRun.floors[floorIndex]
                floor.tiles[`${tile.x}_${tile.y}`] = { tile, tile_type: TileType.LOADING, hidden: false }
                return newRun
            })
        }

        if (!tile.hidden && tile.tile_type === TileType.EXIT) {
            // Set all tiles to loading
            setRun((prevRun) => {
                if (!prevRun) return prevRun
                const newRun = { ...prevRun }
                const floorIndex = newRun.floors.length - 1
                const floor = newRun.floors[floorIndex]
                Object.keys(floor.tiles).forEach((key) => {
                    floor.tiles[key] = { ...floor.tiles[key], tile_type: TileType.LOADING }
                })
                return newRun
            })
        }

        gameActions.activateTile(tile)
    }

    const getPosKey = (x: number, y: number) => x + "_" + y

    const tiles = run?.floors[run.floors.length - 1].tiles

    if (!tiles) {
        return (
            <div className="absolute w-full h-screen flex items-center justify-center">
                <h1 className="text-5xl">Loading...</h1>
            </div>
        )
    }

    const tileElement = (tile: Tile): JSX.Element => {
        if (!tile) return null

        if (tile.tile_type === TileType.LOADING) {
            return (
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${textures["/src/assets/textures/tile/loading.gif"]})`,
                    }}
                />
            )
        }

        if (tile.hidden) {
            return (
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${textures["/src/assets/textures/tile/hidden.webp"]})`,
                    }}
                />
            )
        }

        return (
            <div
                className="w-full h-full bg-cover bg-center"
                style={{
                    backgroundImage: `url(${textures["/src/assets/textures/tile/" + tile.tile_type + ".webp"]})`,
                }}
            ></div>
        )
    }

    return (
        <div className="absolute w-full h-screen flex flex-col items-center justify-center">
            <div className="mr-24 flex flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                    <div className="floor-grid grid grid-cols-5 grid-rows-5 gap-3 bg-[rgba(0,0,0,0.5)] p-4 shadow rounded">
                        {Array.from({ length: 25 }).map((_, index) => {
                            const x = index % 5
                            const y = Math.floor(index / 5)
                            const posKey = getPosKey(x, y)
                            return (
                                <div
                                    key={posKey}
                                    className="relative w-24 h-24 border-4 rounded bg-gray-200 border-gray-900 hover:border-amber-500 cursor-pointer"
                                >
                                    <div
                                        className="relative w-full h-full overflow-hidden"
                                        onClick={() => activeTile(tiles[posKey])}
                                    >
                                        {tileElement(tiles[posKey])}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <button
                        className="mt-2 bg-primary text-light px-8 pt-3 pb-4 rounded text-3xl font-bold"
                        onClick={endRun}
                    >
                        End Run
                    </button>
                </div>
                <div className="text-light text-2xl font-bold bg-[rgba(0,0,0,0.7)] p-4 shadow rounded">
                    <h2>Floor: {run?.floors.length}</h2>
                </div>
            </div>
        </div>
    )
}

export default RunScreen
