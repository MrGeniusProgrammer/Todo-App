"use client"

import { TodoContext } from "@/context/TodoContext";
import { cn } from "@/lib/clientUtils";
import { TodoItemType, TodoListType } from "@/lib/validations/todo.schema";
import { useContext } from "react";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";

export default function TodoDragDrop() {
    const { todoLists, setTodoLists } = useContext(TodoContext);

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination, type } = result

        if (!destination) return
        if (source.droppableId === destination.droppableId && source.index === destination.index) return

        const copiedLists: TodoListType[] = [...todoLists]

        if (type === "CARD") {
            const sourceListIndex: number = todoLists.findIndex((value) => value.id === source.droppableId)
            const destinationListIndex: number = todoLists.findIndex((value) => value.id === destination.droppableId)
            const sourceItems: TodoItemType[] = [...copiedLists[sourceListIndex].todoItems]
            const destinationItems: TodoItemType[] = [...copiedLists[destinationListIndex].todoItems]

            if (source.droppableId === destination.droppableId) {
                const [removed] = sourceItems.splice(source.index, 1)
                sourceItems.splice(destination.index, 0, removed);
                copiedLists[sourceListIndex].todoItems = sourceItems
            } else {
                const [removed] = sourceItems.splice(source.index, 1)
                destinationItems.splice(destination.index, 0, removed)
                copiedLists[sourceListIndex].todoItems = sourceItems
                copiedLists[destinationListIndex].todoItems = destinationItems
            }
        }

        if (type === "ROOT") {
            const [removed] = copiedLists.splice(source.index, 1);
            copiedLists.splice(destination.index, 0, removed);
        }

        setTodoLists(copiedLists)
    }

    return (
        <DragDropContext onDragEnd={result => handleDragEnd(result)}>
            <Droppable droppableId="ROOT" type="ROOT" direction="horizontal" >
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex relative"
                    >
                        {todoLists.map((todoList, index) => (
                            <Draggable key={todoList.id} draggableId={todoList.id} index={index}>
                                {(provided, snapsthot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{ ...provided.draggableProps.style }}
                                        className={cn(
                                            "mx-3 h-fit relative min-w-[300px] max-w-[400px] flex flex-col space-y-2 shadow-lg border-2 bg-primary-foreground border-border rounded-lg",
                                            !todoList.isSearched && "opacity-0 pointer-events-none h-0 w-0 absolute"
                                        )}
                                    >
                                        <TodoCard todoList={todoList} todoListIndex={index} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}