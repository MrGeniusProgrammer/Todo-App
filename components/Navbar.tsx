"use client"

import { TodoContext } from "@/context/TodoContext"
import { UserContext } from "@/context/UserContext"
import { TodoListScheam, TodoListType } from "@/lib/validations/todo.schema"
import { useRouter } from "next/navigation"
import { ChangeEvent, KeyboardEvent, useContext, useEffect, useRef, useState } from "react"
import { v4 } from "uuid"
import Button from "./ui/Button"
import { Input } from "./ui/Input"
import { LogOut } from "lucide-react"
import DarkModeToggle from "./DarkModeToggle"

interface NavbarProps {

}

export default function Navbar({ }: NavbarProps) {
    const router = useRouter()
    const { todoLists, setTodoLists, saveTodoLists, createTodoList } = useContext(TodoContext)
    const { currentUser, logoutCurrentUser } = useContext(UserContext)
    const [isLogoutLoading, setIsLogoutLoading] = useState(false)
    const ref = useRef<HTMLInputElement>(null)

    const handleLogout = async () => {
        setIsLogoutLoading(true)

        try {
            await saveTodoLists()
            await logoutCurrentUser()
            router.push("/login")
        } catch (error) {
            console.log(error)
        } finally {
            setIsLogoutLoading(false)
        }
    }

    const handleCreate = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            const todoListIndex = todoLists.length
            let isSearched: boolean = false

            if (ref.current) {
                if (ref.current.value.trim() === "") {
                    isSearched = true
                } else {
                    isSearched = ref.current.value.toLowerCase().includes(event.currentTarget.value.toLowerCase())
                }
            }

            const todoList: TodoListType = {
                id: v4(),
                header: event.currentTarget.value,
                filterByChecked: false,
                filterByNotChecked: false,
                todoItems: [],
                isSearched: isSearched
            }

            event.currentTarget.value = ""
            createTodoList(todoList, todoListIndex, [...todoLists, todoList])
        }
    }

    const handleSearch = async (value: string) => {
        const copiedTodoLists = [...todoLists]

        for (let i = 0; i < copiedTodoLists.length; i++) {
            const todoList = copiedTodoLists[i]

            if (todoList.header.toLowerCase().includes(value.toLowerCase())) {
                todoList.isSearched = true
            } else {
                todoList.isSearched = false
            }

            if (value.trim() === "") {
                todoList.isSearched = true
            }
        }

        setTodoLists(copiedTodoLists)
    }

    return (
        <nav className="p-4 flex justify-between items-center border-border border-b-2 shadow-xl shadow-background/30 bg-background">
            <div className="flex justify-center items-center space-x-4">
                <Button
                    onClick={handleLogout}
                    isLoading={isLogoutLoading}
                    variant="secondary"
                    className="p-2"
                >
                    {isLogoutLoading ? "" : <LogOut />}
                </Button>
                <div className="flex flex-col">
                    <h1 className="font-medium text-xl">{currentUser.username}</h1>
                    <p className="font-normal text-xs">{currentUser.email}</p>
                </div>
            </div>
            <ul className="flex justify-center items-center grow space-x-4">
                <li>
                    <Input
                        type="text"
                        onKeyDown={handleCreate}
                        placeholder="Create a Todo Card"
                    />
                </li>
                <li>
                    <Input
                        type="text"
                        ref={ref}
                        onChange={(event) => handleSearch(event.currentTarget.value)}
                        onKeyDown={() => handleSearch("")}
                        placeholder="Search Todo Cards"
                    />
                </li>
            </ul>
            <DarkModeToggle />
        </nav>
    )
}
