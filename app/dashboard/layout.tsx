"use client"

import Navbar from '@/components/Navbar'
import TodoProvider from '@/context/TodoContext'
import UserProvider from '@/context/UserContext'
import { FC, ReactNode } from 'react'

interface LayoutProps {
    children: ReactNode
}

export const metadata = {
    title: 'Dashboard',
    description: 'Generated by create next app',
}

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <head>
                <title>Dashboard</title>
            </head>
            <UserProvider>
                <TodoProvider>
                    <div className="h-screen w-screen flex flex-col overflow-hidden">
                        <Navbar />
                        <main className="p-5 grow overflow-scroll">
                            {children}
                        </main>
                    </div>
                </TodoProvider>
            </UserProvider>
        </>
    )
}

export default Layout