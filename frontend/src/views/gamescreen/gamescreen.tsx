import { useContext, useEffect, useState } from "react"
import { GamestateContext } from "../../contexts/gamestate-context"
import GameUI from "./components/game-ui/game-ui"
import { PlayerContext } from "../../contexts/player-context"
import loginBackground from "../../assets/images/background.png"
import HomeScreen from "./components/home-screen/home-screen"
import RunScreen from "./components/run-screen/run-screen"

const Gamescreen = () => {
    const [adminCell, setAdminCell] = useState<{ x: number; y: number } | null>(null)

    const { selectedCell } = useContext(PlayerContext)

    const { run } = useContext(GamestateContext)

    const activeRun = () => run && run.active

    useEffect(() => {
        // console.log(run)
    }, [run])

    return (
        <div className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center overflow-hidden select-none">
            <img src={loginBackground} alt="background" className="absolute w-screen h-screen object-cover -z-10" />
            <div id="fx-layer" className="absolute top-0 left-0 w-full h-full pointer-events-none z-200" />
            <GameUI selectedCell={selectedCell} />
            {activeRun() ? <RunScreen /> : <HomeScreen />}
        </div>
    )
}
export default Gamescreen
