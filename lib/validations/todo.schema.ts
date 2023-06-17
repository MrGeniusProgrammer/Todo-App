import { z } from "zod";

export const TodoItemScheam = z.object({
    id: z.string(),
    content: z.string().min(1, {
        message: "Content is required"
    }),
    checked: z.boolean(),
    isSearched: z.boolean().default(true)
}).superRefine(({ content }, ctx) => {
    if (content.trim() === "") {
        ctx.addIssue({
            message: "Content is only spaces",
            path: ["content"],
            code: "custom"
        })
    }
})

export type TodoItemType = z.infer<typeof TodoItemScheam>

export const TodoListScheam = z.object({
    id: z.string(),
    header: z.string().min(1, {
        message: "Header is required"
    }),
    filterByChecked: z.boolean(),
    filterByNotChecked: z.boolean(),
    todoItems: z.array(TodoItemScheam),
    isSearched: z.boolean().default(true)
}).superRefine(({ header }, ctx) => {
    if (header.trim() === "") {
        ctx.addIssue({
            message: "Header is only spaces",
            path: ["header"],
            code: "custom"
        })
    }
})

export type TodoListType = z.infer<typeof TodoListScheam>