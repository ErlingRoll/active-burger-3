import { Fragment, useContext, useState } from "react"
import { Equipment } from "../../../../../models/item"
import { CharactersContext } from "../../../../../contexts/characters-context"
import { PlayerContext } from "../../../../../contexts/player-context"
import { CRAFTING_CURRENCY } from "../../../../../game/items/currency"

import ItemTooltip from "./item-tooltip"
import ItemInfo from "./item-info"
import { FaTimes } from "react-icons/fa"
import { UIContext } from "../../../../../contexts/ui-context"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const CraftingBench = () => {
    const [item, setItem] = useState<Equipment | null>(null)

    const { items } = useContext(CharactersContext)
    const { gameActions } = useContext(PlayerContext)
    const { setCraftingBenchOpen } = useContext(UIContext)

    function selectEquipment(equipment: Equipment | null) {
        setItem(equipment)
    }

    function getTotalItemCount(itemId: string): { count: number; itemId: string | null } {
        let usingItemId = null
        let total = 0
        items.forEach((i) => {
            if (i.count > 0 && i.item_id === itemId) {
                total += i.count
                usingItemId = i.id
            }
        })
        return { count: total, itemId: usingItemId }
    }

    if (!item) {
        return (
            <div className="relative bg-dark/95 text-light rounded pointer-events-auto px-4 pb-4 pt-2">
                <div className="absolute top-0 right-0">
                    <div
                        className="absolute bottom-2 right-0 bg-danger rounded p-1 cursor-pointer hover:scale-105"
                        onClick={() => setCraftingBenchOpen(false)}
                    >
                        <FaTimes className="text-light text-3xl" />
                    </div>
                </div>
                <p className="text-lg font-bold mb-2">Select item to craft</p>
                <div className="grid grid-cols-4 gap-2">
                    {items
                        .filter((i) => i.equipable)
                        .map((item: Equipment, index) => (
                            <Fragment key={index}>
                                <ItemTooltip item={item} namespace="inventory" />
                                <div
                                    key={index}
                                    id={`inventory-item-${item.id}`}
                                    data-tooltip-place="top-end"
                                    className="relative w-12 h-12 bg-blue-100 border border-gray-400 rounded-sm flex justify-center items-center cursor-pointer hover:border-blue-600"
                                    title={item.name}
                                    onClick={() => selectEquipment(item)}
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
        )
    }

    return (
        <div className="relative bg-dark/95 text-light rounded pointer-events-auto p-4 grid grid-cols-[repeat(2,minmax(0,auto))] gap-4">
            <div className="absolute top-0 right-0">
                <div
                    className="absolute bottom-2 right-0 bg-danger rounded p-1 cursor-pointer hover:scale-105"
                    onClick={() => setCraftingBenchOpen(false)}
                >
                    <FaTimes className="text-light text-3xl" />
                </div>
            </div>
            <div className="min-w-[30rem]">
                <ItemInfo itemId={item.id} showImg={true} onImgClick={() => selectEquipment(null)} />
            </div>
            <div className="flex flex-col items-end shrink gap-4 max-h-[80vh] overflow-y-auto">
                {CRAFTING_CURRENCY.map((currency) => {
                    const itemCount = getTotalItemCount(currency.item_id)
                    return (
                        <div
                            key={currency.item_id}
                            className="w-full relative flex items-center gap-4 bg-primary/40 rounded p-1"
                        >
                            <div className="flex-1">
                                <div className="flex items-center">
                                    <div className="h-6 w-6 mr-0.5">
                                        <img
                                            src={textures[`/src/assets/textures/${currency.texture}.png`]}
                                            alt="Chaos Orb"
                                            className="h-full"
                                        />
                                    </div>
                                    <p className="font-bold">{currency.name}</p>
                                    <p className="ml-2">
                                        <span className="mr-[1px]">x</span>
                                        <b>{itemCount.count}</b>
                                    </p>
                                </div>
                                <p className="text-sm max-w-[18rem]">{currency.description}</p>
                            </div>
                            <button
                                className={
                                    "px-4 py-2 rounded text-light font-bold " +
                                    (itemCount.count <= 0 || !itemCount.itemId
                                        ? "bg-disabled cursor-default!"
                                        : "bg-primary hover:scale-105")
                                }
                                disabled={itemCount.count <= 0 || !itemCount.itemId}
                                onClick={() => {
                                    gameActions.applyCurrency({
                                        currency_id: itemCount.itemId,
                                        equipment_id: item.id,
                                    })
                                }}
                            >
                                Craft
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CraftingBench
