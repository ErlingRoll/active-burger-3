import { usePlayer } from "@/contexts/player-context"
import { useGamestate } from "@/contexts/gamestate-context"
import baseBackground from "@/assets/textures/background/base.webp"
import { FaFireFlameCurved } from "react-icons/fa6"
import Inventory from "./components/inventory"
import Characters from "./components/characters"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const HomeScreen = () => {
    const { user, items } = useGamestate()
    const { gameActions } = usePlayer()

    function startRun() {
        gameActions.startRun()
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

            <div className="absolute top-0 left-0 m-4 flex flex-row gap-4 pointer-events-none">
                <Characters />
                <Inventory />
            </div>
        </div>
    )
}

export default HomeScreen
