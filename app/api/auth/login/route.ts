import { getEnvVariable, getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/token";
import { LoginUserInput, LoginUserSchema } from "@/lib/validations/user.schema";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const origin = req.headers.get("origin")
        const body = (await req.json()) as LoginUserInput
        const data = LoginUserSchema.parse(body)

        const user = await prisma.users.findUnique({
            where: { email: data.email }
        })

        const comparePassword = await compare(data.password, `${user?.password}`)

        LoginUserSchema.superRefine(({ }, ctx) => {
            if (!user || !comparePassword) {
                ctx.addIssue({
                    code: "custom",
                    message: "Email or Password is invalid",
                    path: ["password"],
                })

                ctx.addIssue({
                    code: "custom",
                    message: "Email or Password is invalid",
                    path: ["email"],
                })
            }
        }).parse(data)

        if (!user) {
            return getErrorResponse(500, "User not found")
        }

        const JWT_EXPIRES_IN = getEnvVariable("JWT_EXPIRES_IN")
        const token = await signJWT({ sub: user.id })
        const tokenMaxAge = parseInt(JWT_EXPIRES_IN) * 60
        const cookieOptions = {
            name: "token",
            value: token,
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV !== "development",
            maxAge: tokenMaxAge,
        }

        const response = new NextResponse(
            JSON.stringify({
                token,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": origin || "*"
                },
            }
        )

        await Promise.all([
            response.cookies.set(cookieOptions)
        ])

        return response
    } catch (errors: any) {
        if (errors instanceof z.ZodError) {
            return getErrorResponse(400, "failed validations", errors);
        }

        return getErrorResponse(500, errors.message)
    }
}