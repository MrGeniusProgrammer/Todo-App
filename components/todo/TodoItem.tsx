"use client"

import { TodoContext } from "@/context/TodoContext";
import { TodoItemType, TodoListType } from "@/lib/validations/todo.schema";
import { Edit3 } from "lucide-react";
import { FormEvent, KeyboardEvent, useContext, useState } from "react";
import Button from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";

interface TodoItemContainerProps {
    todoItem: TodoItemType
    todoList: TodoListType
    todoItemIndex: number
    todoListIndex: number
}

export default function TodoItemContainer({ todoItem, todoItemIndex, todoList, todoListIndex }: TodoItemContainerProps) {
    const { todoLists, updateTodoItem } = useContext(TodoContext)
    const [isTextarea, setIsTextarea] = useState(false);

    const handleChecked = async (event: FormEvent<HTMLButtonElement>) => {
        const copiedTodoLists = [...todoLists]
        const isChecked: boolean = event.currentTarget.getAttribute("aria-checked") !== "true"
        copiedTodoLists[todoListIndex].todoItems[todoItemIndex].checked = isChecked

        updateTodoItem(todoList.id, todoItem, copiedTodoLists)
    }

    const handleEdit = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            const copiedTodoLists = [...todoLists]
            copiedTodoLists[todoListIndex].todoItems[todoItemIndex].content = event.currentTarget.value

            setIsTextarea(false)
            updateTodoItem(todoList.id, todoItem, copiedTodoLists)
        }

        if (event.key === "Escape") {
            setIsTextarea(false)
        }
    }

    return (
        <>
            <div className="flex items-center cursor-pointer flex-1 p-1 overflow-hidden">
                <Checkbox
                    onClick={handleChecked}
                    name={todoItem.id}
                    id={todoItem.id}
                    defaultChecked={todoItem.checked}
                    className="mr-3"
                />
                {isTextarea ?
                    <Textarea
                        autoFocus={isTextarea}
                        name={todoItem.id}
                        id={todoItem.id}
                        defaultValue={todoItem.content}
                        onKeyDown={handleEdit}
                        onBlur={() => setIsTextarea(false)}
                        className="grow"
                    />
                    :
                    <Label
                        htmlFor={todoItem.id}
                        className="peer-aria-checked:line-through grow flex items-center h-full cursor-pointer"
                    >
                        {todoItem.content}
                    </Label>
                }
            </div>
            {!isTextarea &&
                <Button
                    variant="ghost"
                    onClick={() => setIsTextarea(true)}
                    className="w-8 h-8 p-2 justify-self-end shrink-0 rounded-full overflow-hidden"
                >
                    <Edit3 />
                </Button>
            }
        </>
    )
}