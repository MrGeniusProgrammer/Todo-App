import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { getUserID, verifyUser } from "@/lib/serverUtils";
import { TodoItemScheam, TodoListScheam, TodoListType } from "@/lib/validations/todo.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
    try {
        const userID = getUserID(req)

        const user = await prisma.users.findUnique({
            where: {
                id: userID
            },
            include: {
                todoLists: {
                    orderBy: [
                        {
                            index: "asc"
                        }
                    ],
                    select: {
                        id: true,
                        header: true,
                        filterByChecked: true,
                        filterByNotChecked: true,
                        todoItems: {
                            orderBy: [{
                                index: "asc"
                            }],
                            select: {
                                id: true,
                                content: true,
                                checked: true
                            }
                        }
                    }
                }
            }
        })

        if (!user) {
            throw new Error("Todo Lists not Found");
        }

        return new NextResponse(JSON.stringify(user.todoLists), { status: 200 })
    } catch (error: any) {
        return getErrorResponse(401, error.message)
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as TodoListType & { index: number }
        const user = await verifyUser(req)

        const { id, filterByChecked, header } = TodoListScheam.parse(body)

        await prisma.todoLists.create({
            data: {
                id,
                header,
                filterByChecked,
                index: body.index,
                usersId: user.id
            }
        })

        return new NextResponse(
            JSON.stringify(null),
            {
                status: 200
            }
        )
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return getErrorResponse(401, "failed validations", error)
        }

        return getErrorResponse(401, error.message)
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = (await req.json()) as TodoListType[]
        const user = await verifyUser(req)

        for (let i = 0; i < body.length; i++) {
            const todoList = TodoListScheam.parse(body[i])

            await prisma.todoLists.upsert({
                where: {
                    id: todoList.id
                },
                update: {
                    id: todoList.id,
                    header: todoList.header,
                    filterByChecked: todoList.filterByChecked,
                    filterByNotChecked: todoList.filterByNotChecked,
                    index: i,
                    usersId: user.id
                },
                create: {
                    id: todoList.id,
                    header: todoList.header,
                    filterByChecked: todoList.filterByChecked,
                    filterByNotChecked: todoList.filterByNotChecked,
                    index: i,
                    usersId: user.id
                },
            })

            for (let j = 0; j < todoList.todoItems.length; j++) {
                const todoItem = TodoItemScheam.parse(todoList.todoItems[j]);

                await prisma.todoItems.upsert({
                    where: {
                        id: todoItem.id
                    },
                    update: {
                        id: todoItem.id,
                        content: todoItem.content,
                        checked: todoItem.checked,
                        todoListsId: todoList.id,
                        index: j
                    },
                    create: {
                        id: todoItem.id,
                        content: todoItem.content,
                        checked: todoItem.checked,
                        todoListsId: todoList.id,
                        index: j
                    },
                })
            }
        }

        return new NextResponse("Success", { status: 200 })
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return getErrorResponse(401, "failed validations", error)
        }

        return getErrorResponse(401, error.message)
    }
}