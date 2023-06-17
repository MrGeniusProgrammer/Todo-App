import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { verifyUser } from "@/lib/serverUtils";
import { TodoItemScheam, TodoItemType } from "@/lib/validations/todo.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest, { params }: { params: { todoListID: string } }) {
    try {
        const body = (await req.json()) as TodoItemType & { index: number }
        await verifyUser(req)

        const { id, checked, content } = TodoItemScheam.parse(body)

        await prisma.todoItems.create({
            data: {
                id,
                checked,
                content,
                index: body.index,
                todoListsId: params.todoListID
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