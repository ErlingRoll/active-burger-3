import { FaDroplet, FaHeart } from "react-icons/fa6"
import { Character as CharacterType } from "../../../../../game/objects"
import { PiSwordBold } from "react-icons/pi"
import { useContext, useState } from "react"
import { MdStars } from "react-icons/md"
import { CharactersContext } from "../../../../../contexts/characters-context"
import { GiKnifeThrust } from "react-icons/gi"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const Characters = () => {
    const { characters } = useContext(CharactersContext)

    const Character = ({ character }: { character: CharacterType }) => (
        <div className="flex flex-row gap-4 bg-[rgba(0,0,0,0.8)] p-2">
            <div className="flex flex-col items-center gap-2">
                <h3 className="text-xl font-bold pl-2">
                    {character.name} <span className="text-sm text-amber-500">Lvl {character.level}</span>
                </h3>
                <img
                    className="h-[20vh]"
                    src={textures[`/src/assets/textures/character/${character.texture}.png`]}
                    alt="character"
                />
            </div>
            <div className="flex flex-col gap-2 font-bold">
                <div className="flex flex-row items-center gap-1 pt-[0.2rem]">
                    <MdStars color="lightblue" className="mt-[1px]" />
                    <p>
                        {character.level_progress} / {character.level}
                    </p>
                </div>
                <div className="flex flex-row items-center gap-1">
                    <FaHeart color="red" className="mt-[1px]" />
                    <p>{character.hp}</p>
                </div>
                <div className="flex flex-row gap-1">
                    <FaDroplet color="blue" className="mt-[4px]" />
                    <p>{character.mana}</p>
                </div>
                <div className="flex flex-row items-center gap-1">
                    <GiKnifeThrust color="lightgray" className="mt-[1px]" />
                    <p>{character.damage}</p>
                </div>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col gap-4 text-lg rounded p-4">
            <h2 className="text-2xl font-bold">Party</h2>
            <div className="w-full bg-light rounded h-[3px]" />
            <div className="flex flex-col gap-4">
                {characters[0] ? (
                    <Character character={characters[0]} />
                ) : (
                    <div className="h-[24vh] flex items-center justify-center bg-[rgba(0,0,0,0.8)] rounded">
                        <p className="italic text-gray-400">Empty slot</p>
                    </div>
                )}
                {characters[1] ? (
                    <Character character={characters[1]} />
                ) : (
                    <div className="h-[24vh] flex items-center justify-center bg-[rgba(0,0,0,0.8)] rounded">
                        <p className="italic text-gray-400">Empty slot</p>
                    </div>
                )}
                {characters[2] ? (
                    <Character character={characters[2]} />
                ) : (
                    <div className="h-[24vh] flex items-center justify-center bg-[rgba(0,0,0,0.8)] rounded">
                        <p className="italic text-gray-400">Empty slot</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Characters
