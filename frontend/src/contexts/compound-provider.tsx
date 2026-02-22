import { ReactNode } from "react"
import { UserProvider } from "@/contexts/user-context"
import { CharactersProvider } from "@/contexts/characters-context"
import { UIProvider } from "@/contexts/ui-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { GamestateProvider } from "@/contexts/gamestate-provider"
import { PlayerProvider } from "@/contexts/player-provider"

const CompoundProvider = ({ children }: { children: ReactNode }) => {
    const providers = [
        PlayerProvider,
        UIProvider,
        GamestateProvider,
        CharactersProvider,
        UserProvider,
        SettingsProvider,
    ]
    return providers.reduce((acc, Provider) => <Provider>{acc}</Provider>, children)
}

export default CompoundProvider
