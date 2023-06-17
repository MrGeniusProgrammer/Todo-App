import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { verifyUser } from "@/lib/serverUtils";
import { TodoListScheam, TodoListType } from "@/lib/validations/todo.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function DELETE(req: NextRequest, { params }: { params: { todoListID: string } }) {
    try {
        const user = await verifyUser(req)

        await prisma.todoItems.deleteMany({
            where: {
                todoListsId: params.todoListID
            }
        })

        await prisma.todoLists.deleteMany({
            where: {
                id: params.todoListID,
                usersId: user.id,
            }
        })

        return new NextResponse(JSON.stringify(null), { status: 200 })
    } catch (error: any) {
        return getErrorResponse(401, error.message)
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { todoListID: string } }) {
    try {
        const body = (await req.json()) as TodoListType
        const user = await verifyUser(req)

        const { id, filterByChecked, filterByNotChecked, header, todoItems } = TodoListScheam.parse(body)

        for (let i = 0; i < todoItems.length; i++) {
            const { id, checked, content } = todoItems[i];
            await prisma.todoItems.update({
                where: {
                    id
                },
                data: {
                    id,
                    checked,
                    content,
                    index: i,
                    todoListsId: params.todoListID
                }
            })
        }

        await prisma.todoLists.update({
            where: {
                id: params.todoListID
            },
            data: {
                id,
                filterByChecked,
                filterByNotChecked,
                header,
                usersId: user.id
            }
        })

        return new NextResponse(JSON.stringify(null), { status: 200 })
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return getErrorResponse(401, "Failed validations", error)
        }

        return getErrorResponse(401, error.message)
    }
}