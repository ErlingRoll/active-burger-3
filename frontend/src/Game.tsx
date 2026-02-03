import "./App.css"
import { useContext } from "react"
import Gamescreen from "./views/gamescreen/gamescreen"
import { UserContext } from "./contexts/user-context"
import Login from "./views/login/login"
import { GamestateContext } from "./contexts/gamestate-context"
import { CharacterContext } from "./contexts/character-context"

function Game() {
    const { externalUser } = useContext(UserContext)
    const { gameCon, user } = useContext(GamestateContext)

    const urlPaths = window.location.pathname.split("/")
    const mainPath = urlPaths[1].toLocaleLowerCase()

    if (!externalUser || !gameCon || !user) {
        return <Login />
    }

    // if (!gamestate.render_objects[character.id]) {
    //     return (
    //         <div className="absolute top-0 left-0 w-full h-full center-col text-light font-bold">
    //             <p className="mb-2">Loading game...</p>
    //             <p>If this takes too long, please try refreshing the page.</p>
    //             <p className="mb-2">If that doesn't work contact Erling</p>
    //             <p>WebSocket status: {gameCon ? "Connected" : "Disconnected"}</p>
    //             <p>gamestate: {gamestate ? "Yes" : "No"}</p>
    //             <p>Render objects: {gamestate ? Object.keys(gamestate.render_objects).length : "null"}</p>
    //         </div>
    //     )
    // }

    return <Gamescreen />
}

export default Game
