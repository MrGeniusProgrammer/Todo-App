import { NextRequest } from "next/server";
import { prisma } from "./prisma";

export function getUserID(req: NextRequest) {
    const userID = req.headers.get("X-USER-ID")

    if (!userID) {
        throw new Error("User ID Not Found")
    }

    return userID
}

export async function getUserByID(userID: string) {
    const user = await prisma.users.findUnique({
        where: {
            id: userID
        }
    })

    if (!user) {
        throw new Error("User not Found");
    }

    return user
}

export async function verifyUser(req: NextRequest) {
    const userID = getUserID(req)
    const user = getUserByID(userID)

    return user
}