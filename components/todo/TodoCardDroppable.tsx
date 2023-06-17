"use client"

import { TodoContext } from "@/context/TodoContext";
import { cn } from "@/lib/clientUtils";
import { TodoItemType, TodoListType } from "@/lib/validations/todo.schema";
import { Edit2, MoreVertical, Search, SlidersHorizontal, Trash, Trash2 } from "lucide-react";
import { KeyboardEvent, MouseEvent, useContext, useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { v4 } from "uuid";
import Button from "../ui/Button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/Dropdown-Menu";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import TodoItemContainer from "./TodoItemContainer";

interface TodoCardDroppableProps {
    todoList: TodoListType
    todoListIndex: number
}

export default function TodoCardDroppable({ todoList, todoListIndex }: TodoCardDroppableProps) {
    const { todoLists, setTodoLists, deleteTodoList, updateTodoList, createTodoItem, deleteTodoItem } = useContext(TodoContext)
    const [isTextarea, setIsTextarea] = useState(false)
    const [isInput, setIsInput] = useState(false)
    const ref = useRef<HTMLInputElement>(null)

    const handleDeleteTodoList = async (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        const copiedTodoLists = [...todoLists]
        copiedTodoLists.splice(todoListIndex, 1)

        deleteTodoList(todoList, copiedTodoLists)
    }

    const handleDeleteTodoItem = async (todoItem: TodoItemType, todoItemIndex: number) => {
        const copiedTodoLists = [...todoLists]
        copiedTodoLists[todoListIndex].todoItems.splice(todoItemIndex, 1)

        deleteTodoItem(todoList.id, todoItem, copiedTodoLists)
    }

    const handleCreate = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            let isSearched: boolean = false

            if (ref.current) {
                if (ref.current.value.trim() === "") {
                    isSearched = true
                } else {
                    isSearched = ref.current.value.toLowerCase().includes(event.currentTarget.value.toLowerCase())
                }
            }

            const todoItemIndex = todoLists[todoListIndex].todoItems.length
            const todoItem: TodoItemType = {
                id: v4(),
                checked: false,
                content: event.currentTarget.value,
                isSearched: isSearched
            }

            const copiedTodoLists = [...todoLists]
            copiedTodoLists[todoListIndex].todoItems = [...copiedTodoLists[todoListIndex].todoItems, todoItem]

            event.currentTarget.value = ""
            createTodoItem(todoList.id, todoItem, todoItemIndex, copiedTodoLists)
        }
    }

    const handleEdit = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            const copiedTodoLists = [...todoLists]
            copiedTodoLists[todoListIndex].header = event.currentTarget.value

            setIsTextarea(false)
            updateTodoList(todoList, copiedTodoLists)
        }

        if (event.key === "Escape") {
            setIsTextarea(false)
        }
    }

    const handleSearch = async (value: string) => {
        const copiedTodoLists = [...todoLists]

        for (let i = 0; i < copiedTodoLists[todoListIndex].todoItems.length; i++) {
            const todoItem = copiedTodoLists[todoListIndex].todoItems[i]

            if (todoItem.content.toLowerCase().includes(value.toLowerCase())) {
                todoItem.isSearched = true
            } else {
                todoItem.isSearched = false
            }

            if (value.trim() === "") {
                todoItem.isSearched = true
            }
        }

        setTodoLists(copiedTodoLists)
    }

    const handleFilter = async (checked?: boolean, all?: boolean) => {
        const copiedTodoLists = [...todoLists]

        if (checked) {
            copiedTodoLists[todoListIndex].filterByChecked = !copiedTodoLists[todoListIndex].filterByChecked
        } else {
            copiedTodoLists[todoListIndex].filterByNotChecked = !copiedTodoLists[todoListIndex].filterByNotChecked
        }

        if (all) {
            copiedTodoLists[todoListIndex].filterByChecked = true
            copiedTodoLists[todoListIndex].filterByNotChecked = true
        }

        updateTodoList(todoList, copiedTodoLists)
    }

    return (
        <Droppable droppableId={todoList.id} type="CARD">
            {(provided, snapshot) => (
                <div
                    className="flex flex-col space-y-2 shadow-lg border-2 bg-primary-foreground border-border rounded-lg h-full"
                >
                    <header className="font-medium flex flex-col justify-center space-y-2 cursor-pointer text-xl w-full px-4 pt-4">
                        <div className="flex justify-between items-center flex-1">
                            {isTextarea ?
                                <Textarea
                                    onKeyDown={handleEdit}
                                    defaultValue={todoList.header}
                                    autoFocus={isTextarea}
                                    onBlur={() => setIsTextarea(false)}
                                    className="text-xl"
                                />
                                :
                                <h1 className="grow cursor-pointer"> {todoList.header} </h1>
                            }
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="sm" className="w-9 h-9 p-2.5 ml-3 rounded-full object-cover">
                                        <MoreVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="p-1">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={() => setIsTextarea(true)}
                                            className="cursor-pointer pl-1"
                                        >
                                            <Edit2 className="w-4 h-4 mx-1" />
                                            <span className="pl-1">Edit</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleDeleteTodoList}
                                            className="cursor-pointer pl-1"
                                        >
                                            <Trash className="w-4 h-4 mx-1" />
                                            <span className="pl-1">Delete</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setIsInput(true)}
                                            className="cursor-pointer pl-1"
                                        >
                                            <Search className="w-4 h-4 mx-1" />
                                            <span className="pl-1">Search</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </DropdownMenuGroup>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <SlidersHorizontal className="w-4 h-4 mr-1" />
                                            <span className="pl-1">Filter By</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuCheckboxItem
                                                checked={todoList.filterByChecked}
                                                onCheckedChange={() => handleFilter(true)}
                                                className="cursor-pointer"
                                            >
                                                Checked
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                checked={todoList.filterByNotChecked}
                                                onCheckedChange={() => handleFilter(false)}
                                                className="cursor-pointer"
                                            >
                                                Not Checked
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                checked={todoList.filterByChecked === todoList.filterByNotChecked}
                                                onCheckedChange={() => handleFilter(undefined, true)}
                                                className="cursor-pointer"
                                            >
                                                All
                                            </DropdownMenuCheckboxItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Input
                            type="text"
                            ref={ref}
                            autoFocus={isInput}
                            onKeyDown={(event) => { if (event.key === "Escape") { handleSearch(""); setIsInput(false); event.currentTarget.value = ""; } }}
                            onBlur={(event) => { handleSearch(""); setIsInput(false); event.currentTarget.value = ""; }}
                            onChange={(event) => handleSearch(event.currentTarget.value)}
                            placeholder="Search Todo Items"
                            className={cn(
                                "w-full",
                                !isInput && "hidden"
                            )}
                        />
                    </header>
                    <main
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex flex-col space-y-3 w-full px-4 py-4"
                    >
                        {todoList.todoItems.map((todoItem, index) => (
                            <Draggable key={todoItem.id} draggableId={todoItem.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{ ...provided.draggableProps.style }}
                                        className={cn(
                                            "flex space-x-2 relative p-3 rounded-lg border-2 border-secondary hover:bg-secondary hover:text-secondary-foreground group",
                                            snapshot.isDragging && "bg-secondary text-secondary-foreground",
                                            !(todoList.filterByChecked === todoList.filterByNotChecked) ? ((todoList.filterByChecked && !todoItem.checked) || (todoList.filterByNotChecked && todoItem.checked) && "opacity-0 pointer-events-none h-0 w-0 absolute") : "",
                                            !todoItem.isSearched && "opacity-0 pointer-events-none h-0 w-0 absolute"
                                        )}
                                    >
                                        <TodoItemContainer
                                            todoItem={todoItem}
                                            todoItemIndex={index}
                                            todoList={todoList}
                                            todoListIndex={todoListIndex}
                                        />
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDeleteTodoItem(todoItem, index)}
                                            className="w-6 h-6 p-1 absolute top-0 right-0 translate-x-2/4 -translate-y-2/4 rounded-full pointer-events-none opacity-0 scale-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:scale-100"
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                )
                                }
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </main>
                    <footer className="w-full p-4 border-t-2 border-border">
                        <Input
                            type="text"
                            onKeyDown={handleCreate}
                            placeholder="Create a Todo"
                        />
                    </footer>
                </div>
            )}
        </Droppable>
    )
}