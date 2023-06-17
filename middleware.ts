import { NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "./lib/helpers";
import { verifyJWT } from "./lib/token";

const allowedOrigins = ["http://localhost:3000"]
const authRoutes = ["/login", "/register"]
const protectedRoutes = ["/dashboard"]

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const origin = req.headers.get("origin")
    const token = req.cookies.get("token")?.value
    const response = NextResponse.next()

    if (origin && !allowedOrigins.includes(origin)) {
        return getErrorResponse(400, "Bad Request")
    }

    try {
        if (token) {
            const { sub } = await verifyJWT(token)
            if (sub) {
                response.headers.set("X-USER-ID", sub)
            }
        }
    } catch (error) {
        if (pathname.startsWith("/api")) {
            return getErrorResponse(401, "Unaouthorized")
        }

        req.nextUrl.pathname = "/login"
        return NextResponse.redirect(req.nextUrl, { status: 307 })
    }

    if (protectedRoutes.includes(pathname) && (!response.headers.has("X-USER-ID") || !token)) {
        req.nextUrl.pathname = "/login"
        return NextResponse.redirect(req.nextUrl, { status: 307 })
    }

    if (authRoutes.includes(pathname) && response.headers.has("X-USER-ID")) {
        req.nextUrl.pathname = "/dashboard"
        return NextResponse.redirect(req.nextUrl, { status: 307 })
    }

    return response
}

export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico (favicon file)
        */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}