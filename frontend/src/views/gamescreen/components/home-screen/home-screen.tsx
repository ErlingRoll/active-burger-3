import { useContext } from "react"
import { PlayerContext } from "../../../../contexts/player-context"
import { GamestateContext } from "../../../../contexts/gamestate-context"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const HomeScreen = () => {
    const { user } = useContext(GamestateContext)
    const { gameActions } = useContext(PlayerContext)

    const partyLeader = user.characters[0]

    function startRun() {
        gameActions.startRun()
    }

    return (
        <div className="absolute w-full h-screen flex justify-end flex-col items-center">
            <div className="w-full h-full absolute flex flex-col items-center justify-center">
                <button
                    className="ml-32 mb-48 bg-primary text-light px-8 pt-3 pb-4 rounded text-3xl font-bold hover:scale-105"
                    onClick={startRun}
                >
                    Enter Dungeon
                </button>
            </div>

            <img
                className="ml-32 h-[24vh]"
                src={textures[`/src/assets/textures/character/${partyLeader.texture}.png`]}
                alt="character"
            />
        </div>
    )
}

export default HomeScreen
