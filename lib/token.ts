import { getEnvVariable } from "./helpers";
import { SignJWT, jwtVerify } from "jose";

export const signJWT = async (
    payload: { sub: string },
    options: {
        exp: string,
        alg: string,
        key: string
    } = {
            exp: `${getEnvVariable("JWT_EXPIRES_IN")}m`,
            alg: getEnvVariable("JWT_ALGORITHEM"),
            key: getEnvVariable("JWT_SECRET_KEY")
        },
) => {
    try {
        const secret = new TextEncoder().encode(options.key)
        return new SignJWT(payload)
            .setProtectedHeader({ alg: options.alg })
            .setExpirationTime(options.exp)
            .setIssuedAt()
            .setSubject(payload.sub)
            .sign(secret)
    } catch (error) {
        throw error
    }
}

export const verifyJWT = async (token: string) => {
    try {
        return (await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET_KEY)
        )).payload

    } catch (error) {
        throw new Error("Your token has expired.")
    }
}
