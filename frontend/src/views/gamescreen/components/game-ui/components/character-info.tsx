import { useContext, useState } from "react"
import { CharactersContext } from "../../../../../contexts/characters-context"
import { UserContext } from "../../../../../contexts/user-context"
import { GamestateContext } from "../../../../../contexts/gamestate-context"
import { FaHeart } from "react-icons/fa"
import { RiCopperCoinFill } from "react-icons/ri"

const CharacterInfo = () => {
    const { gamestate } = useContext(GamestateContext)
    const { admin } = useContext(UserContext)
    const { characters: character } = useContext(CharactersContext)

    const [debug, setDebug] = useState<boolean>(false)

    return (
        <div className="m-4 p-2 pt-0 bg-dark/90 text-light rounded flex flex-col items-center">
            <div className="center-col items-start! font-bold">
                <p className="font-bold text-lg">{character.name}</p>
                <div className="flex items-center">
                    <p className="font-bold">
                        Level <span className="text-primary">{character.level}</span>
                    </p>
                </div>
                <div className="flex items-center mb-2">
                    <p className="font-bold">
                        Exp <span className="text-primary">{character.current_exp}</span> /{" "}
                        <span className="text-primary">{character.max_exp}</span>
                    </p>
                </div>
                <div className="flex items-center">
                    <FaHeart color="red" className="mr-2 mt-1" />
                    <p>
                        {character.current_hp} / {character.max_hp}
                    </p>
                </div>
                <div className="flex items-center mt-1">
                    <RiCopperCoinFill color="gold" className="mr-2" />
                    <p>{character.gold}</p>
                </div>
                {debug && <p className="">Character: {character.id}</p>}
                {debug && <p className="">Account: {character.account_id}</p>}
                {debug && <p className="">Admin: {admin ? "Yes" : "No"}</p>}
                {debug && (
                    <p className="">
                        <b>Pos :</b> ({gamestate.render_objects[character.id].x},{" "}
                        {gamestate.render_objects[character.id].y})
                    </p>
                )}
            </div>
        </div>
    )
}

export default CharacterInfo
