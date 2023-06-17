"use client"

import { FC, useState } from 'react'
import Button from './ui/Button'
import { Moon, Sun } from 'lucide-react'

const DarkModeToggle: FC = () => {
    let storedDarkMode = localStorage.getItem("darkMode")

    if (!storedDarkMode) {
        localStorage.setItem("darkMode", "enabled")
        storedDarkMode = "enabled"
    }

    const [darkMode, setDarkMode] = useState<boolean>(storedDarkMode === "enabled")
    document.body.classList.toggle("dark", darkMode)

    const handleClick = () => {
        setDarkMode(prevDarkMode => !prevDarkMode)
        document.body.classList.toggle("dark", darkMode)
        localStorage.setItem("darkMode", darkMode ? "disabled" : "enabled")
    }

    return (
        <Button
            onClick={handleClick}
            variant="ghost"
            className='p-2'
        >
            {
                darkMode ?
                    <Sun size={24} />
                    :
                    <Moon size={24} />
            }
        </Button>
    )
}

export default DarkModeToggle