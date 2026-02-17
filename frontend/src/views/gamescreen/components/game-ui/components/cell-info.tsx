import { Fragment, useContext, useEffect, useState } from "react"
import { CharactersContext } from "../../../../../contexts/characters-context"
import { UserContext } from "../../../../../contexts/user-context"
import { GamestateContext } from "../../../../../contexts/gamestate-context"
import { Character, Entity, RenderObject } from "../../../../../models/object"
import { FaHeart } from "react-icons/fa"
import { modSymbol } from "../../../../../game/items/mods"

const CellInfo = ({ pos }: { pos: { x: number; y: number } | null }) => {
    const { gamestate } = useContext(GamestateContext)
    const { admin } = useContext(UserContext)
    const { characters: character } = useContext(CharactersContext)

    const [debug, setDebug] = useState<boolean>(false)
    const [objects, setObjects] = useState<Partial<RenderObject & Character & Entity>[]>([])
    const [monsters, setMonsters] = useState<Entity[]>([])

    useEffect(() => {
        if (!pos) return
        const posObjects = gamestate.position_objects[`${pos.x}_${pos.y}`] || []
        setMonsters(posObjects.filter((obj) => obj.type === "monster") as Entity[])
        setObjects(posObjects.filter((obj) => obj.type !== "monster"))
    }, [pos])

    if (!pos || (objects.length === 0 && monsters.length === 0)) return null

    return (
        <div className="m-4 p-2 pt-0 bg-dark/90 text-light rounded flex flex-col items-start pointer-events-auto z-300">
            <div className="center-col items-start!">
                {monsters.map((monster) => (
                    <div key={monster.id}>
                        <p className="font-bold text-lg">{monster.name}</p>
                        <div className="flex items-center mb-1">
                            <p className="font-bold">
                                Level <span className="text-primary">{monster.level}</span>
                            </p>
                        </div>
                        <div className="grid grid-cols-[repeat(2,minmax(0,auto))] items-center gap-x-1 font-bold">
                            <FaHeart color="red" className="ml-0.5" />
                            <p>
                                {(monster as any).current_hp} / {(monster as any).max_hp}
                            </p>
                            {Object.entries(monster.props.weapon_mods || {}).map(([mod, value]: any) => {
                                const symbol = modSymbol[mod]
                                if (!symbol) return null
                                return (
                                    <Fragment key={mod}>
                                        <span>{symbol}</span>
                                        <span>{value}</span>
                                    </Fragment>
                                )
                            })}
                        </div>
                    </div>
                ))}
                {objects.map((obj) => (
                    <div key={obj.id}>
                        <p className="font-bold text-lg">{obj.name}</p>
                        {obj.hasOwnProperty("level") && (
                            <div className="flex items-center">
                                <p className="font-bold">
                                    Level <span className="text-primary">{obj.level}</span>
                                </p>
                            </div>
                        )}
                        {obj.hasOwnProperty("current_hp") && (
                            <div className="flex items-center">
                                <FaHeart color="red" className="mr-2" />
                                <p>
                                    {(obj as any).current_hp} / {(obj as any).max_hp}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CellInfo
