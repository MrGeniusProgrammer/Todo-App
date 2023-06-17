"use client"

import { cn } from '@/lib/clientUtils'
import '@/styles/globals.css'
import { Roboto } from 'next/font/google'

const roboto = Roboto({ weight: "400", subsets: ["latin"] })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    let storedDarkMode = localStorage.getItem("darkMode")

    if (!storedDarkMode) {
        localStorage.setItem("darkMode", "enabled")
        storedDarkMode = "enabled"
    }

    return (
        <html lang="en">
            <body className={cn(
                roboto.className,
                storedDarkMode === "enabled" && "dark"
            )}
            >
                {children}
            </body>
        </html>
    )
}
