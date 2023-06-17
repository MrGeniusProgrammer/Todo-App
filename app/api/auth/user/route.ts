import { getErrorResponse } from "@/lib/helpers";
import { verifyUser } from "@/lib/serverUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const user = await verifyUser(req)

        return new NextResponse(JSON.stringify({ username: user.username, email: user.email }), { status: 200 });
    } catch (error: any) {
        return getErrorResponse(500, error.message)
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const response = new NextResponse(
            "Succes",
            {
                status: 200
            }
        );

        await Promise.all([
            response.cookies.set({
                name: "token",
                value: "",
                maxAge: -1
            })
        ]);

        return response;
    } catch (error: any) {
        return getErrorResponse(500, error.message)
    }
}