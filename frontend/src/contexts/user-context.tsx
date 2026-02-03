import React, { Dispatch, SetStateAction, createContext } from "react"
import { User as UserType } from "../models/account"

export type User = UserType & any

type UserContextType = {
    externalUser: User | null
    setExternalUser: Dispatch<SetStateAction<User | null>>
}

export const UserContext = createContext<UserContextType>({
    externalUser: null,
    setExternalUser: (user: any) => {},
})

export const UserProvider = ({ children }: { children: any }) => {
    const [externalUser, setExternalUser] = React.useState<User | null>(null)

    return <UserContext.Provider value={{ externalUser, setExternalUser }}>{children}</UserContext.Provider>
}
