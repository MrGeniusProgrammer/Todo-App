"use client"

import Button from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Form, FormControl, FormField, FormInput, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { setFormErrors } from "@/lib/clientUtils"
import { RegisterUserInput, RegisterUserSchema } from "@/lib/validations/user.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { typeToFlattenedError } from "zod"

function Page() {
    const pathname = usePathname()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<RegisterUserInput>({
        resolver: zodResolver(RegisterUserSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function handleSubmit(values: RegisterUserInput) {
        setIsLoading(true)

        const res = await fetch(`/api/auth/${pathname}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        })

        const resData = await res.json()

        if (!res.ok) {
            const errors: typeToFlattenedError<any, string> = resData.errors
            setIsLoading(false)
            return setFormErrors(errors, form)
        }

        router.push("/login")
        setIsLoading(false)
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <h1 className="text-2xl">Register</h1>
                <span>Already have an account <Link href="/login" className="underline text-secondary-foreground">Login!</Link></span>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 min-w-[400px]">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl className="relative">
                                        <FormInput placeholder="Username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <FormInput type="email" placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <FormInput type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <FormInput type="password" placeholder="Confirm Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button isLoading={isLoading} type="submit" className="w-full">REGISTER</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default Page