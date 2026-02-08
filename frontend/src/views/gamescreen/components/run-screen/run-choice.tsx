import { useContext, useEffect, useState } from "react"
import { GamestateContext } from "../../../../contexts/gamestate-context"
import { LootRunOption, RunChoice } from "../../../../game/objects"
import { LootType, Rarity, RunOptionType } from "../../../../models/constants"
import { PlayerContext } from "../../../../contexts/player-context"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const RunChoiceModal = () => {
    const { runChoices, setRunChoices } = useContext(GamestateContext)
    const { gameActions } = useContext(PlayerContext)

    const [currentChoice, setCurrentChoice] = useState<RunChoice | null>(null)

    useEffect(() => {
        // console.log(runChoices)
        if (runChoices.length > 0) {
            setCurrentChoice(runChoices[0])
        } else {
            setCurrentChoice(null)
        }
    }, [runChoices])

    function selectOption(option: LootRunOption) {
        if (!currentChoice) return console.error("Trying to select run option but no current choice???")
        setRunChoices((prev) => prev.slice(1))
        gameActions.selectRunOption({
            tile_id: currentChoice.tile_id || "",
            option,
        })
    }

    if (!currentChoice) return null

    if (currentChoice.options.length === 0) throw new Error("Run choice has no options???")

    return (
        <div className="fixed left-0 top-0 w-screen h-screen flex items-center justify-center bg-[rgba(0,0,0,0.7)] text-light z-10">
            <div className="mb-24 p-4 rounded-lg flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">Choose loot!</h2>
                <div className="flex flex-row gap-4">
                    {currentChoice.options.map((option, index) => (
                        <div
                            key={index}
                            className="w-48 h-64 flex flex-col items-center justify-between bg-gray-800 p-4 rounded-lg cursor-pointer border-4 border-gray-900 hover:bg-gray-600"
                            onClick={() => selectOption(option)}
                        >
                            <img
                                src={textures[`/src/assets/textures/${option.texture}.webp`]}
                                alt={option.title || "option"}
                                className="w-16 h-16 mt-2 mb-2"
                            />
                            <h3 className="text-xl font-bold">{option.count}</h3>
                            <h3
                                className={
                                    "font-bold mb-4 " +
                                    (option.loot_type == LootType.GOLD ? "text-amber-400" : "") +
                                    (option.loot_type == LootType.ESSENCE ? "text-[#00F0DF]" : "")
                                }
                            >
                                {option.title}
                            </h3>
                            <p className="text-xs  flex-1 text-center">{option.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RunChoiceModal
