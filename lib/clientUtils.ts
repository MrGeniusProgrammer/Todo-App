import { ClassValue, clsx } from "clsx"
import { UseFormReturn } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { typeToFlattenedError } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function setFormErrors(errors: typeToFlattenedError<any, string>, form: UseFormReturn<any>) {
  try {
    Object.keys(errors.fieldErrors).map((value: any) => {
      const path = errors.fieldErrors[value]

      if (path) {
        form.setError(value, {
          message: path[0]
        })
      }
    })
  } catch (error) {
    return error
  }
}
