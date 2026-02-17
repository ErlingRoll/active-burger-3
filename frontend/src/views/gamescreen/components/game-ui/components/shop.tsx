import { Fragment, useContext, useMemo, useState } from "react"
import { CharactersContext } from "../../../../../contexts/characters-context"
import { RiCopperCoinFill } from "react-icons/ri"
import { UIContext } from "../../../../../contexts/ui-context"
import { PlayerContext } from "../../../../../contexts/player-context"
import ItemTooltip from "./item-tooltip"
import { ShopItem } from "../../../../../game/shop/shop"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const shopTabs = ["Sell", "Buy"]

const Shop = () => {
    const [tab, setTab] = useState<number>(0)

    const { gameActions } = useContext(PlayerContext)
    const { items } = useContext(CharactersContext)
    const { setShopOpen, shopItems } = useContext(UIContext)

    const tabName = useMemo(() => {
        return shopTabs[tab]
    }, [tab])

    return (
        <div className="relative min-w-48 min-h-[50vh] bg-dark/95 text-light overflow-hidden rounded pointer-events-auto">
            <div className="flex flex-row items-stretch justify-between">
                {shopTabs.map((t, i) => (
                    <button
                        key={t}
                        className={`inline h-full text-2xl font-bold px-4 rounded-none! pb-1 ${
                            tab !== i && "bg-light text-dark"
                        }`}
                        onClick={() => setTab(i)}
                    >
                        {t}
                    </button>
                ))}
                <div className="min-w-24 grow bg-light" />
                <button
                    className="text-lg font-bold px-4 cursor-pointer rounded-none! bg-danger text-light"
                    onClick={() => setShopOpen(false)}
                >
                    Close
                </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
                {tabName === "Sell" && (
                    <div className="grid grid-cols-[repeat(7,minmax(0,auto))] gap-4 items-center">
                        {items.map((item) => (
                            <Fragment key={item.id}>
                                <ItemTooltip item={item} namespace="shop" />
                                <div className="center-col w-12 h-12">
                                    <img
                                        id={`shop-item-${item.id}`}
                                        src={textures[`/src/assets/textures/${item.texture}.png`]}
                                        className="h-full"
                                    />
                                </div>
                                <p id={`shop-item-${item.id}`} className="font-bold text-lg">
                                    {item.name}
                                </p>
                                <p className="font-bold text-lg">x {item.count || 1}</p>
                                <div className="flex flex-row items-center gap-1">
                                    <RiCopperCoinFill color="gold" className="" />
                                    <p className="font-bold text-lg">{item.value}</p>
                                </div>
                                <button
                                    className="bg-primary text-light font-bold rounded px-4 py-2"
                                    onClick={() => gameActions.sell({ item_id: item.id, count: 1 })}
                                >
                                    Sell
                                </button>
                                <button
                                    className="bg-primary text-light font-bold rounded px-4 py-2 whitespace-nowrap"
                                    onClick={() => gameActions.sell({ item_id: item.id, count: 10 })}
                                >
                                    Sell x10
                                </button>
                                <button
                                    className="bg-primary text-light font-bold rounded px-4 py-2 whitespace-nowrap"
                                    onClick={() => gameActions.sell({ item_id: item.id, count: item.count || 1 })}
                                >
                                    Sell All
                                </button>
                            </Fragment>
                        ))}
                    </div>
                )}
                {tabName === "Buy" && (
                    <div className="grid grid-cols-[repeat(6,minmax(0,auto))] gap-4 items-center">
                        {shopItems.map((shopItem: ShopItem, index) => {
                            const item = shopItem.item
                            return (
                                <Fragment key={index}>
                                    <ItemTooltip item={{ id: item.item_id + "-" + index, ...item }} namespace="shop" />
                                    <div className="center-col w-12 h-12">
                                        <img
                                            id={`shop-item-${item.item_id}-${index}`}
                                            src={textures[`/src/assets/textures/${item.texture}.png`]}
                                            className="h-full"
                                        />
                                    </div>
                                    <p id={`shop-item-${item.item_id}-${index}`} className="font-bold text-lg">
                                        {item.name}
                                    </p>
                                    <p className="font-bold text-lg">
                                        {item.count && item.count > 1 ? `x ${item.count}` : null}
                                    </p>
                                    <div className="flex flex-row items-center gap-1">
                                        <RiCopperCoinFill color="gold" className="" />
                                        <p className="font-bold text-lg">{shopItem.price}</p>
                                    </div>
                                    <button
                                        className="bg-primary text-light font-bold rounded px-4 py-1"
                                        onClick={() =>
                                            gameActions.buy({ item_id: item.item_id!, price: shopItem.price, count: 1 })
                                        }
                                    >
                                        Buy
                                    </button>
                                    {shopItem.multiple ? (
                                        <button
                                            className="bg-primary text-light font-bold rounded px-4 py-1"
                                            onClick={() =>
                                                gameActions.buy({
                                                    item_id: item.item_id!,
                                                    price: shopItem.price,
                                                    count: 5,
                                                })
                                            }
                                        >
                                            Buy 5
                                        </button>
                                    ) : (
                                        <div className="w-0 h-0" />
                                    )}
                                </Fragment>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Shop
