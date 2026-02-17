import { Dispatch, SetStateAction, createContext, useState } from "react"
import { Character } from "../game/objects"

type CharactersContextType = {
    characters: Character[] | null
    setCharacters: Dispatch<SetStateAction<Character[] | null>>
    updateCharacter: (updatedCharacter: Character) => void
}

export const CharactersContext = createContext<CharactersContextType>({
    characters: [],
    setCharacters: (characters: Character[]) => {},
    updateCharacter: (updatedCharacter: Character) => {},
})

export const CharactersProvider = ({ children }: { children: any }) => {
    const [characters, setCharacters] = useState<Character[] | null>(null)

    function updateCharacter(updatedCharacter: Character) {
        setCharacters((prevCharacters) => {
            if (!prevCharacters) {
                return [updatedCharacter]
            }
            return prevCharacters.map((character) =>
                character.id === updatedCharacter.id ? updatedCharacter : character
            )
        })
    }

    return (
        <CharactersContext.Provider
            value={{
                characters,
                setCharacters,
                updateCharacter,
            }}
        >
            {children}
        </CharactersContext.Provider>
    )
}
