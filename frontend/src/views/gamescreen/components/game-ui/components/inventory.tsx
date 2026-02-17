import { Fragment, useContext } from "react"
import { CharactersContext } from "../../../../../contexts/characters-context"
import { PlayerContext } from "../../../../../contexts/player-context"
import ItemTooltip from "./item-tooltip"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const Inventory = () => {
    const { items } = useContext(CharactersContext)
    const { gameActions } = useContext(PlayerContext)

    return (
        <div className="p-4 pt-2 bg-dark/90 text-light rounded flex flex-col items-center pointer-events-auto">
            <div className="center-col items-start!">
                <p className="w-full font-bold text-lg mb-2">Inventory</p>
                <div className="min-h-48">
                    <div className="grid grid-cols-4 gap-2">
                        {items.map((item, index) => (
                            <Fragment key={index}>
                                <ItemTooltip item={item} namespace="inventory" />
                                <div
                                    key={index}
                                    id={`inventory-item-${item.id}`}
                                    data-tooltip-place="top-end"
                                    className={`relative w-12 h-12 bg-dark border-2 rounded-sm flex justify-center items-center cursor-pointer hover:border-primary`}
                                    onClick={() => gameActions.useItem({ id: item.id })}
                                >
                                    <img
                                        src={textures[`/src/assets/textures/${item.texture}.png`]}
                                        alt={item.name}
                                        className="h-full"
                                    />
                                    {item.stackable && (
                                        <div className="absolute bottom-0 left-0 bg-light/70 text-dark rounded">
                                            <p className="-mt-[2px] px-[1px] text-sm font-bold">{item.count}</p>
                                        </div>
                                    )}
                                </div>
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Inventory
