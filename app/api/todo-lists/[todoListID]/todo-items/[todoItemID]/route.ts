import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { verifyUser } from "@/lib/serverUtils";
import { TodoItemScheam, TodoItemType } from "@/lib/validations/todo.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function DELETE(req: NextRequest, { params }: { params: { todoItemID: string, todoListID: string } }) {
    try {
        await verifyUser(req)

        await prisma.todoItems.deleteMany({
            where: {
                id: params.todoItemID,
                todoListsId: params.todoListID
            }
        })

        return new NextResponse(JSON.stringify(null), { status: 200 })
    } catch (error: any) {
        return getErrorResponse(401, error.message)
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { todoItemID: string, todoListID: string } }) {
    try {
        const body = (await req.json()) as TodoItemType
        await verifyUser(req)

        const { id, checked, content } = TodoItemScheam.parse(body)

        await prisma.todoItems.updateMany({
            where: {
                id: params.todoItemID,
                todoListsId: params.todoListID
            },
            data: {
                id,
                checked,
                content
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