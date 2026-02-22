import "./App.css"
import { useContext } from "react"
import Gamescreen from "./views/gamescreen/gamescreen"
import { UserContext } from "./contexts/user-context"
import Login from "./views/login/login"
import { useGamestate } from "./contexts/gamestate-context"

function Game() {
    const { externalUser } = useContext(UserContext)
    const { gameCon, user } = useGamestate()

    if (!externalUser || !gameCon || !user) {
        return <Login />
    }

    return <Gamescreen />
}

export default Game
