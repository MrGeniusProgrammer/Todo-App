import { getEnvVariable, getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { RegisterUserInput, RegisterUserSchema } from "@/lib/validations/user.schema";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as RegisterUserInput
        const data = RegisterUserSchema.parse(body)

        const emailFound = await prisma.users.findUnique({
            where: { email: data.email }
        })

        const usernameFound = await prisma.users.findUnique({
            where: { username: data.username }
        })

        RegisterUserSchema.superRefine(({ }, ctx) => {
            if (usernameFound?.username) {
                ctx.addIssue({
                    code: "custom",
                    message: "Username already taken",
                    path: ["username"]
                })
            }

            if (emailFound?.email) {
                ctx.addIssue({
                    code: "custom",
                    message: "Email already taken",
                    path: ["email"]
                })
            }
        }).parse(data)

        const hashedPassword = await hash(body.password, parseInt(getEnvVariable("SALT")));

        await prisma.users.create({
            data: {
                username: body.username,
                email: body.email,
                password: hashedPassword
            }
        })

        return new NextResponse(JSON.stringify(null), { status: 200 })
    } catch (errors: any) {
        if (errors instanceof z.ZodError) {
            return getErrorResponse(400, "failed validations", errors);
        }

        return getErrorResponse(500, errors.message)
    }
}