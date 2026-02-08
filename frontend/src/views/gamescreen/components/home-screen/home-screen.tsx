import { useContext, useState } from "react"
import { PlayerContext } from "../../../../contexts/player-context"
import { GamestateContext } from "../../../../contexts/gamestate-context"
import baseBackground from "../../../../assets/textures/background/base.webp"
import { RiCopperCoinFill } from "react-icons/ri"
import { FaDroplet, FaFireFlameCurved, FaHeart } from "react-icons/fa6"
import { Character } from "../../../../game/objects"
import { LuSwords } from "react-icons/lu"
import { PiSwordBold } from "react-icons/pi"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const HomeScreen = () => {
    const { user } = useContext(GamestateContext)
    const { gameActions } = useContext(PlayerContext)

    const [characters, setCharacters] = useState<Character[]>(user.characters)

    function startRun() {
        gameActions.startRun()
    }

    const Character = ({ character }: { character: Character }) => {
        return (
            <div className="flex flex-row gap-4 bg-[rgba(0,0,0,0.8)] p-2">
                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-xl font-bold pl-2">
                        {character.name} <span className="text-sm">Lvl {character.level}</span>
                    </h3>
                    <img
                        className="h-[20vh]"
                        src={textures[`/src/assets/textures/character/${character.texture}.png`]}
                        alt="character"
                    />
                </div>
                <div className="flex flex-col gap-2 font-bold">
                    <p className="text-xl font-bold text-transparent">{character.name}</p>
                    <div className="flex flex-row items-center gap-1">
                        <FaHeart color="red" className="mt-[1px]" />
                        <p>{character.hp}</p>
                    </div>
                    <div className="flex flex-row gap-1">
                        <FaDroplet color="blue" className="mt-[4px]" />
                        <p>{character.mana}</p>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <PiSwordBold color="gray" className="mt-[1px]" />
                        <p>{character.damage}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="absolute w-full h-screen flex justify-end flex-col items-center">
            <img src={baseBackground} alt="background" className="absolute w-screen h-screen object-cover -z-10" />
            <div className="w-full h-full absolute flex flex-col items-center justify-center">
                <button
                    className="ml-2 mt-[30rem] bg-primary text-light px-6 pt-3 pb-4 rounded text-3xl font-bold hover:scale-105"
                    onClick={startRun}
                >
                    Enter Dungeon
                </button>
            </div>

            <div className="absolute top-0 right-0 m-4 flex flex-col gap-2 items-end text-2xl font-bold text-right">
                <h2 className="text-3xl font-bold">{user.name}</h2>
                <div className="flex flex-row items-center gap-1">
                    <p>{user.essence}</p>
                    <FaFireFlameCurved color="#00F0DF" />
                </div>
            </div>

            <div className="absolute top-0 left-0 m-4 flex flex-col gap-4 text-lg rounded p-4">
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
                        <Character character={characters[0]} />
                    ) : (
                        <div className="h-[24vh] flex items-center justify-center bg-[rgba(0,0,0,0.8)] rounded">
                            <p className="italic text-gray-400">Empty slot</p>
                        </div>
                    )}
                    {characters[1] ? (
                        <Character character={characters[0]} />
                    ) : (
                        <div className="h-[24vh] flex items-center justify-center bg-[rgba(0,0,0,0.8)] rounded">
                            <p className="italic text-gray-400">Empty slot</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HomeScreen
