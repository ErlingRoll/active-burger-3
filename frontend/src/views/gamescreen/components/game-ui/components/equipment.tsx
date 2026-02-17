import { Fragment, useContext } from "react"
import { CharactersContext } from "../../../../../contexts/characters-context"
import ItemTooltip from "./item-tooltip"
import { PlayerContext } from "../../../../../contexts/player-context"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const Equipment = () => {
    const { gameActions } = useContext(PlayerContext)
    const { equipment } = useContext(CharactersContext)

    return (
        <div id="equipment" className="p-4 bg-dark/90 text-light rounded pointer-events-auto">
            <div className="grid grid-cols-[repeat(2,minmax(0,auto))] items-center gap-2">
                {Object.entries(equipment).map(([slot, item]) => (
                    <Fragment key={slot}>
                        <p className="font-bold text-md capitalize">{slot}:</p>
                        {item ? (
                            <div className="flex flex-row items-center gap-2">
                                <div className="bg-light/90 rounded center-col">
                                    <ItemTooltip item={item} namespace="equipment" place="top-start" />
                                    <img
                                        id={`equipment-item-${item.id}`}
                                        src={textures[`/src/assets/textures/${item.texture}.png`]}
                                        alt={item.name}
                                        className="w-10 h-10 cursor-pointer"
                                        onClick={() => gameActions.unequipItem({ slot })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="h-10 w-10 bg-light/30 rounded" />
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default Equipment
