"use client"

import { TodoItemScheam, TodoItemType, TodoListScheam, TodoListType } from "@/lib/validations/todo.schema";
import { ReactNode, SetStateAction, createContext, useEffect, useState } from "react";

export type TodoContextType = {
    todoLists: TodoListType[]
    setTodoLists: (todoLists: SetStateAction<TodoListType[]>) => void

    getTodoLists: () => void
    saveTodoLists: () => void
    createTodoList: (todoList: TodoListType, index: number, todoLists: TodoListType[]) => void
    updateTodoList: (todoList: TodoListType, todoLists: TodoListType[]) => void
    deleteTodoList: (todoList: TodoListType, todoLists: TodoListType[]) => void
    createTodoItem: (todoListId: string, todoList: TodoItemType, index: number, todoLists: TodoListType[]) => void
    updateTodoItem: (todoListId: string, todoList: TodoItemType, todoLists: TodoListType[]) => void
    deleteTodoItem: (todoListId: string, todoList: TodoItemType, todoLists: TodoListType[]) => void
}

export const TodoContext = createContext<TodoContextType>({
    todoLists: [],
    setTodoLists: () => { },
    getTodoLists: () => { },
    saveTodoLists: () => { },
    createTodoList: () => { },
    updateTodoList: () => { },
    deleteTodoList: () => { },
    createTodoItem: () => { },
    updateTodoItem: () => { },
    deleteTodoItem: () => { },
})

const TodoProvider = ({ children }: { children: ReactNode }) => {
    const [todoLists, setTodoLists] = useState<TodoListType[]>([])

    const getTodoLists = async () => {
        try {
            const response = await fetch("/api/todo-lists", { method: "GET" });
            const data = await response.json()

            for (let i = 0; i < data.length; i++) {
                const todoList = data[i];
                data[i] = TodoListScheam.parse(todoList)
            }

            setTodoLists(data)
        } catch (error) {
            return error
        }
    }

    const saveTodoLists = async () => {
        try {
            await fetch("/api/todo-lists", {
                method: "PUT",
                body: JSON.stringify(todoLists)
            })
        } catch (error) {
            return error
        }
    }

    const createTodoList = async (todoList: TodoListType, index: number, todoLists: TodoListType[]) => {
        try {
            TodoListScheam.parse(todoList)

            fetch(`/api/todo-lists`, {
                method: "POST",
                body: JSON.stringify({ ...todoList, index })
            })

            setTodoLists(todoLists)
        } catch (error) {
            return error
        }
    }

    const updateTodoList = async (todoList: TodoListType, todoLists: TodoListType[]) => {
        try {
            TodoListScheam.parse(todoList)

            fetch(`/api/todo-lists/${todoList.id}`, {
                method: "PATCH",
                body: JSON.stringify(todoList)
            })

            setTodoLists(todoLists)
        } catch (error) {
            return error
        }
    }

    const deleteTodoList = async (todoList: TodoListType, todoLists: TodoListType[]) => {
        try {
            TodoListScheam.parse(todoList)

            fetch(`/api/todo-lists/${todoList.id}`, {
                method: "DELETE",
                body: JSON.stringify(todoList)
            })

            setTodoLists(todoLists)
        } catch (error) {
            return error
        }
    }

    const createTodoItem = async (todoListId: string, todoItem: TodoItemType, index: number, todoLists: TodoListType[]) => {
        try {
            TodoItemScheam.parse(todoItem)

            fetch(`/api/todo-lists/${todoListId}/todo-items`, {
                method: "POST",
                body: JSON.stringify({ ...todoItem, index })
            })

            setTodoLists(todoLists)
        } catch (error) {
            return error
        }
    }

    const updateTodoItem = async (todoListId: string, todoItem: TodoItemType, todoLists: TodoListType[]) => {
        try {
            TodoItemScheam.parse(todoItem)

            fetch(`/api/todo-lists/${todoListId}/todo-items/${todoItem.id}`, {
                method: "PATCH",
                body: JSON.stringify(todoItem)
            })

            setTodoLists(todoLists)
        } catch (error) {
            return error
        }
    }

    const deleteTodoItem = async (todoListId: string, todoItem: TodoItemType, todoLists: TodoListType[]) => {
        try {
            TodoItemScheam.parse(todoItem)

            fetch(`/api/todo-lists/${todoListId}/todo-items/${todoItem.id}`, {
                method: "DELETE",
                body: JSON.stringify(todoItem)
            })

            setTodoLists(todoLists)
        } catch (error) {
            return error
        }
    }

    useEffect(() => {
        getTodoLists();
    }, [])

    useEffect(() => {
        saveTodoLists()
    }, [todoLists])

    return (
        <TodoContext.Provider
            value={{
                todoLists,
                setTodoLists,
                getTodoLists,
                saveTodoLists,
                createTodoList,
                updateTodoList,
                deleteTodoList,
                createTodoItem,
                updateTodoItem,
                deleteTodoItem
            }}
        >
            {children}
        </TodoContext.Provider>
    )
}

export default TodoProvider