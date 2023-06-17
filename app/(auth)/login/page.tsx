"use client"

import Button from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Form, FormControl, FormField, FormInput, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { setFormErrors } from "@/lib/clientUtils"
import { LoginUserInput, LoginUserSchema } from "@/lib/validations/user.schema"
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
    const form = useForm<LoginUserInput>({
        resolver: zodResolver(LoginUserSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function handleSubmit(values: LoginUserInput) {
        setIsLoading(true)

        const res = await fetch(`/api/auth/${pathname}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        })

        const resData = (await res.json())

        if (!res.ok) {
            const errors: typeToFlattenedError<any, string> = resData.errors
            setIsLoading(false)
            return setFormErrors(errors, form)
        }

        router.push("/dashboard")
        setIsLoading(false)
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <h1 className="text-2xl">Login</h1>
                <span>Dont have an account <Link href="/register" className="underline text-secondary-foreground">Register!</Link></span>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 min-w-[400px]">
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
                        <Button isLoading={isLoading} type="submit" className="w-full">LOGIN</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default Page