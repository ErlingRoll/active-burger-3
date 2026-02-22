import { ReactNode } from "react"
import { UserProvider } from "@/contexts/user-context"
import { CharactersProvider } from "@/contexts/characters-context"
import { GameProvider } from "@/contexts/gamestate-context"
import { UIProvider } from "@/contexts/ui-context"
import { PlayerProvider } from "@/contexts/player-context"
import { SettingsProvider } from "@/contexts/settings-context"

const CompoundProvider = ({ children }: { children: ReactNode }) => {
    const providers = [PlayerProvider, UIProvider, GameProvider, CharactersProvider, UserProvider, SettingsProvider]
    return providers.reduce((acc, Provider) => <Provider>{acc}</Provider>, children)
}

export default CompoundProvider
