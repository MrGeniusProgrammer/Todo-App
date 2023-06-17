import { z } from "zod"

export const RegisterUserSchema = z.object({
    username: z.string({
        invalid_type_error: "Username is not string",
        required_error: "Username is required",
    }).trim().min(6, {
        message: "Username must be at least 6 characters."
    }).max(30, {
        message: "Username must be lower than 30 characters"
    }),
    email: z.string({
        invalid_type_error: "Email is not string",
        required_error: "Email is required",
    }).trim().email({
        message: "Email is invalid"
    }).min(15, {
        message: "Email must be at least 15 characters.",
    }).max(30, {
        message: "Email must be lower than 30 characters"
    }),
    password: z.string({
        invalid_type_error: "Password is not string",
        required_error: "Password is required",
    }).trim().min(10, {
        message: "Password must be at least 10 characters."
    }).max(30, {
        message: "Password must be lower than 30 characters"
    }),
    confirmPassword: z.string({
        invalid_type_error: "Confirm Password is not string",
        required_error: "Confirm Password is required",
    }),
}).refine(data => data.confirmPassword === data.password, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
})

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>

export const LoginUserSchema = z.object({
    email: z.string({
        invalid_type_error: "Email is not string",
        required_error: "Email is required",
    }).trim().email({
        message: "Email is invalid"
    }),
    password: z.string({
        invalid_type_error: "Password is not string",
        required_error: "Password is required",
    }).trim()
})

export type LoginUserInput = z.infer<typeof LoginUserSchema>