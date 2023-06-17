"use client"

import { User } from '@/types/user'
import { useRouter } from 'next/navigation'
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react'

interface UserContextProps {
    children: ReactNode
}

export type UserContextType = {
    currentUser: User
    setCurrentUser: Dispatch<SetStateAction<User>>
    getCurrentUser: () => void
    logoutCurrentUser: () => void
}

export const UserContext = createContext<UserContextType>({
    currentUser: { email: "", username: "" },
    setCurrentUser: () => { },
    getCurrentUser: () => { },
    logoutCurrentUser: () => { },
});

const UserProvider: FC<UserContextProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User>({ username: "", email: "" });
    const router = useRouter();

    const getCurrentUser = async () => {
        try {
            const response = await fetch("/api/auth/user", { method: "GET" });
            setCurrentUser(await response.json());
        } catch (error) {
            return router.push("/login");
        }
    }

    const logoutCurrentUser = async () => {
        try {
            await fetch("/api/auth/user", { method: "DELETE" });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
        <>
            <UserContext.Provider
                value={{
                    currentUser,
                    setCurrentUser,
                    getCurrentUser,
                    logoutCurrentUser
                }}
            >
                {children}
            </UserContext.Provider>
        </>
    )
}

export default UserProvider;