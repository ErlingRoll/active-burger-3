import { useContext, useEffect, useState } from "react"

import { exchangeCodeForToken, fetchDiscordUser, initiateDiscordLogin } from "../../services/discord-login"

// Assets
import loginLogo from "../../assets/images/login_logo.png"
import loginBackground from "../../assets/images/background.png"
import { UserContext } from "../../contexts/user-context"
import { GamestateContext } from "../../contexts/gamestate-context"
import { ThreeDot } from "react-loading-indicators"

const Login = () => {
    const [loading, setLoading] = useState(false)

    const { code } = Object.fromEntries(new URLSearchParams(window.location.search))

    const { externalUser: user, setExternalUser: setUser } = useContext(UserContext)
    const { gameCon, setGameCon, gamestate: game, setGamestate: setGame } = useContext(GamestateContext)

    function login() {
        setLoading(true)
        initiateDiscordLogin()
    }

    async function discordLogin() {
        const token = await exchangeCodeForToken(code)
            .catch((error) => {
                console.error("Error during token exchange:", error)
            })
            .then((data) => {
                // Store access token securely
                localStorage.setItem("discordAccessToken", data.access_token)
                localStorage.setItem("discordRefreshToken", data.refresh_token)

                return data.access_token
            })
            .catch((error) => {
                console.error("Error during token exchange:", error)
                window.location.href = "/login"
            })

        fetchDiscordUser(token)
            .then((userData) => {
                localStorage.setItem("discordUser", JSON.stringify(userData))
                setUser(userData)
                window.history.replaceState({}, document.title, "/game")
            })
            .catch((error) => {
                console.error("Error fetching user data:", error)
                window.location.href = "/login"
            })
    }

    useEffect(() => {
        let existingUser = localStorage.getItem("discordUser")
        if (existingUser) {
            setUser(JSON.parse(existingUser))
            return
        }

        if (!code || code.trim() == "") return

        discordLogin()
    }, [])

    return (
        <div id="login" className="relative">
            <img src={loginBackground} alt="background" className="absolute w-screen h-screen object-cover -z-10" />
            <div className="flex flex-col justify-center items-center h-screen gap-12 pb-24">
                {/* <img src={loginLogo} alt="title" className="main-logo w-[24rem]" /> */}
                <div className="bg-white/70 px-24 py-8 flex flex-col items-center justify-center rounded-lg">
                    {loading || code || user ? (
                        <div className="relative flex flex-col justify-center items-center">
                            <p className="mb-2">Logging in</p>
                            <ThreeDot color="#ed7d27" size="medium" text="" textColor="" />
                        </div>
                    ) : (
                        <button
                            className="bg-primary text-light px-4 py-2 rounded text-xl font-bold hover:scale-105"
                            onClick={login}
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Login
