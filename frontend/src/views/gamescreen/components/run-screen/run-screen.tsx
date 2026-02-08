import { JSX, useContext, useEffect, useState } from "react"
import { PlayerContext } from "../../../../contexts/player-context"
import { GamestateContext } from "../../../../contexts/gamestate-context"
import { Tile } from "../../../../game/objects"
import { TileType } from "../../../../models/tiles"
import { RiCopperCoinFill } from "react-icons/ri"
import { FaDroplet, FaFireFlameCurved } from "react-icons/fa6"
import { TileObjectType } from "../../../../models/constants"
import dungeonBackground from "../../../../assets/textures/background/dungeon.webp"
import { FaHeart } from "react-icons/fa"
import RunChoiceModal from "./run-choice"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const RunScreen = () => {
    const { run, setRun, runStats, floors } = useContext(GamestateContext)
    const { gameActions } = useContext(PlayerContext)

    const [tiles, setTiles] = useState<{ [pos: string]: Tile }>({})

    useEffect(() => {
        const currentFloor = run?.floors[run.floors.length - 1]
        const tiles = currentFloor?.tiles || {}
        setTiles(tiles)
        // console.log("Run:", run)
        // console.log("Tiles:", tiles)
    }, [run])

    function endRun() {
        gameActions.endRun()
    }

    function activeTile(tile: Tile): void {
        if (!tile) return
        const tileType = tile.tile_type
        const tileObject = tile.tile_object

        if (tileType === TileType.LOADING) {
            return
        }

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

        if (!tile.hidden && tileObject?.tile_object_type === TileObjectType.EXIT) {
            // Set all tiles to loading
            const newTiles: { [pos: string]: Tile } = {}
            Object.keys(tiles).forEach((pos) => {
                newTiles[pos] = { ...tiles[pos], tile_type: TileType.LOADING }
            })
            console.log("Activating exit, setting tiles to loading")
            setTiles(newTiles)
        }

        gameActions.activateTile(tile)
    }

    const getPosKey = (x: number, y: number) => x + "_" + y

    if (!tiles) {
        return (
            <div className="absolute w-full h-screen flex items-center justify-center">
                <h1 className="text-5xl">Loading...</h1>
            </div>
        )
    }

    const tileElement = (tile: Tile): JSX.Element => {
        if (!tile) return null

        const tileType = tile.tile_type
        const tileObject = tile.tile_object

        if (tileType === TileType.LOADING) {
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
                    backgroundImage: `url(${textures["/src/assets/textures/tile/default.webp"]})`,
                }}
            >
                {tileObject && (
                    <div
                        style={{
                            backgroundImage: `url(${textures[`/src/assets/textures/tile-object/${tileObject.tile_object_type}/${tileObject.tile_object_type}-${tileObject.rarity}.webp`]})`,
                        }}
                        className="w-full h-full bg-contain"
                    />
                )}
            </div>
        )
    }

    return (
        <div className="absolute w-full h-screen flex flex-col items-center justify-center">
            <img src={dungeonBackground} alt="background" className="absolute w-screen h-screen object-cover -z-10" />
            <RunChoiceModal />
            <div className="mb-[10vh] relative flex flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                    <div className="floor-grid grid grid-cols-5 grid-rows-5 gap-3 bg-[rgba(0,0,0,0.7)] p-4 shadow rounded">
                        {Array.from({ length: 25 }).map((_, index) => {
                            const x = index % 5
                            const y = Math.floor(index / 5)
                            const posKey = getPosKey(x, y)
                            return (
                                <div
                                    id={`tile-${posKey}`}
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
                </div>
                <div className="absolute min-w-48 left-full ml-4 text-light text-1xl font-bold bg-[rgba(0,0,0,0.7)] p-4 shadow rounded">
                    <h2 className="text-2xl mb-1 whitespace-nowrap">Floor: {run?.floors.length}</h2>
                    <div className="flex flex-row items-center gap-1">
                        <RiCopperCoinFill color="gold" /> {runStats?.gold}
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <FaFireFlameCurved color="#00F0DF" />
                        {runStats?.essence}
                    </div>
                </div>
                <div className="absolute top-full mt-4 w-full flex flex-col items-center gap-2">
                    <div className="w-full flex flex-row items-center gap-2">
                        <FaHeart color="red" />
                        <div className="relative flex-1 bg-gray-700 rounded-full overflow-hidden border-2 border-dark">
                            <div
                                className="bg-red-500 h-5"
                                style={{ width: `${(run?.party_hp / run?.party_max_hp) * 100}%` }}
                            />
                            <p className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                                {run?.party_hp} / {run?.party_max_hp}
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex flex-row items-center gap-2">
                        <FaDroplet color="blue" />
                        <div className="relative flex-1 bg-gray-700 rounded-full overflow-hidden border-2 border-dark">
                            <div
                                className="bg-blue-500 h-5"
                                style={{ width: `${(run?.party_mana / run?.party_max_mana) * 100}%` }}
                            />
                            <p className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                                {run?.party_mana} / {run?.party_max_mana}
                            </p>
                        </div>
                    </div>
                    <button
                        className="w-48 mt-8 bg-danger text-light px-8 pt-3 pb-4 rounded text-2xl font-bold"
                        onClick={endRun}
                    >
                        End Run
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RunScreen
