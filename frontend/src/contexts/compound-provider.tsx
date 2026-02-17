import { ReactNode } from "react"
import { UserProvider } from "./user-context"
import { CharactersProvider } from "./characters-context"
import { GameProvider } from "./gamestate-context"
import { UIProvider } from "./ui-context"
import { PlayerProvider } from "./player-context"
import { SettingsProvider } from "./settings-context"

const CompoundProvider = ({ children }: { children: ReactNode }) => {
    const providers = [PlayerProvider, UIProvider, GameProvider, CharactersProvider, UserProvider, SettingsProvider]
    return providers.reduce((acc, Provider) => <Provider>{acc}</Provider>, children)
}

export default CompoundProvider
