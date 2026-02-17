import { useContext, useEffect, useState } from "react"
import { CharactersContext } from "../../../../../contexts/characters-context"
import { RiCopperCoinFill } from "react-icons/ri"
import { Item } from "../../../../../game/objects"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

type ItemInfoProps = {
    itemId: string
    item?: Partial<Item>
    showImg?: boolean
    onImgClick?: () => void
}

const ItemInfo = ({ itemId, item, showImg, onImgClick }: ItemInfoProps) => {
    const [_item, setItem] = useState<Partial<Item>>(null)
    const [baseMods, setBaseMods] = useState<{ [key: string]: number }>()
    const [mods, setMods] = useState<{ [key: string]: number }>()
    const [prefix, setPrefix] = useState<string | null>(null)
    const [suffix, setSuffix] = useState<string | null>(null)

    // const { items, itemMap } = useContext(CharacterContext)

    // function includesAny(text, substrings) {
    //     for (let i = 0; i < substrings.length; i++) {
    //         if (text.includes(substrings[i])) {
    //             return true // Found a match
    //         }
    //     }
    //     return false // No match found
    // }

    // useEffect(() => {
    //     if (!_item) return
    //     const baseMods = {}
    //     Object.entries(_item.base_mods || {})
    //         .sort(([a], [b]) => a.localeCompare(b))
    //         .forEach(([key, value]) => {
    //             baseMods[key] = (baseMods[key] || 0) + value
    //         })
    //     const mods = {}
    //     Object.entries(_item.mods || {})
    //         .sort(([a], [b]) => a.localeCompare(b))
    //         .forEach(([key, value]) => {
    //             mods[key] = (mods[key] || 0) + value
    //         })
    //     setBaseMods(baseMods)
    //     setMods(mods)
    //     if (_item.props == null) return
    //     setPrefix(_item.props["prefix"] || null)
    //     setSuffix(_item.props["suffix"] || null)
    // }, [_item])

    useEffect(() => {
        // if (itemId && itemMap) {
        //     const inventoryItem = itemMap[itemId]
        //     if (inventoryItem) return setItem(inventoryItem)
        // }
        if (item) return setItem(item)
    }, [itemId, item])

    if (!_item) {
        return <div>Loading item...</div>
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center mb-1">
                {showImg && (
                    <div
                        className="relative w-10 h-10 mr-4 bg-blue-100 border border-gray-400 rounded-sm center-col cursor-pointer hover:border-primary"
                        title={_item.name}
                        onClick={() => onImgClick && onImgClick()}
                    >
                        <img
                            src={textures[`/src/assets/textures/${_item.texture}.webp`]}
                            alt={_item.name}
                            className="h-full"
                        />
                    </div>
                )}
                <div>
                    <p className="font-bold text-xl text-light">
                        {prefix && <span className="text-orange-200 text-lg">{prefix} </span>}
                        {_item.name}
                        {suffix && <span className="text-orange-200 text-lg"> of {suffix}</span>}
                    </p>
                    <p className={`capitalize text-sm text-${_item.rarity} dark-shadow font-bold -mt-1`}>
                        {_item.rarity}
                    </p>
                </div>
            </div>
            <div className="flex flex-row items-center gap-1">
                <RiCopperCoinFill color="gold" className="" />
                <p className="font-bold text-lg">{_item.value}</p>
            </div>
            {/* {_item.equipable && (
                <div className="w-fit center-col items-start! mt-1">
                    {baseMods && Object.keys(baseMods).length ? (
                        <div className="text-gray-300">
                            {Object.entries(baseMods).map(([mod, value], index) => (
                                <div key={index} className="text-sm flex items-center gap-1">
                                    <p className="capitalize">{mod.replaceAll("_", " ")}:</p>
                                    <p className={"font-bold " + (value >= 0 ? "text-green-500" : "text-red-500")}>
                                        {value >= 0 ? `${value}` : value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>Empty implicit mods</div>
                    )}
                    <div className="w-full mt-2 mb-1 border-b border-dashed border-light" />
                    {mods && Object.keys(mods).length ? (
                        <div className="font-bold">
                            {Object.entries(mods).map(([mod, value], index) => {
                                return (
                                    <div key={index} className="text-sm flex items-center gap-1">
                                        <p className="capitalize">{mod.replaceAll("_", " ")}:</p>
                                        <p className={value >= 0 ? "text-green-500" : "text-red-500"}>
                                            {value >= 0 ? `${value}` : value}
                                            {includesAny(mod, ["increased", "chance", "multiplier", "reflect"]) && "%"}
                                        </p>
                                        {mod === _item.props?.locked_mod && (
                                            <p className="ml-1 text-primary">(Locked)</p>
                                        )}
                                        <p className="ml-1 text-gray-500 text-[0.7rem]">
                                            (Tier {getModTier(_item.type, mod, value)})
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div>
                            Empty <b>explicit</b> mods
                        </div>
                    )}
                </div>
            )} */}
            {_item.description && <p className="text-sm mt-2">{_item.description}</p>}
        </div>
    )
}

export default ItemInfo
