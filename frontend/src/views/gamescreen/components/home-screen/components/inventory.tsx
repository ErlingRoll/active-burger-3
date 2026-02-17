import { Fragment, useContext, useState } from "react"
import { GamestateContext } from "../../../../../contexts/gamestate-context"
import ItemTooltip from "../../game-ui/components/item-tooltip"
import { Item } from "../../../../../game/objects"
import { PlayerContext } from "../../../../../contexts/player-context"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const Inventory = () => {
    const { items } = useContext(GamestateContext)
    const { gameActions } = useContext(PlayerContext)

    function useItem(item: Item) {
        gameActions.useItem(item.id)
    }

    return (
        <div className="flex flex-col gap-4 text-lg rounded p-4 pointer-events-none">
            <h2 className="text-2xl font-bold">Inventory</h2>
            <div className="w-full bg-light rounded h-[3px]" />
            <div className="grid grid-cols-8 gap-2 bg-[rgba(0,0,0,0.8)] rounded p-2 pointer-events-auto">
                {items.map((item) => (
                    <Fragment key={item.id}>
                        <ItemTooltip item={item} namespace="inventory" />
                        <div
                            id={`inventory-item-${item.id}`}
                            data-tooltip-place="top-end"
                            className={`w-12 h-12 bg-slate-800 border-2 border-${item.rarity} rounded cursor-pointer`}
                            onClick={() => useItem(item)}
                        >
                            <img
                                key={item.id}
                                src={textures[`/src/assets/textures/${item.texture}.webp`]}
                                alt={item.name}
                                className="w-full h-full"
                            />
                        </div>
                    </Fragment>
                ))}
                {items.length === 0 && <div className="col-span-8 h-16 center-col italic">Inventory is empty</div>}
            </div>
        </div>
    )
}
export default Inventory
