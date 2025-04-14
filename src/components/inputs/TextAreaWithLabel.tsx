"use client"

import { Textarea } from "../ui/textarea"
import { useFormContext } from "react-hook-form"
import { TextareaHTMLAttributes } from "react"
import {
    FormControl,
    FormItem,
    FormLabel,
    FormField,
    FormMessage
} from "@/components/ui/form"

type Props<S>={
    fieldTitle:string,
    nameInSchema: keyof S & string,
    className:string,
}& TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextAreaWithLabel<S>({
    fieldTitle,
    nameInSchema,
    className,
    ...props
}:Props<S>){
    const form=useFormContext();
    return(
        <FormField
            control={form.control}
            name={nameInSchema}
            render={({field})=>(
                <FormItem>

                    <FormLabel
                    className="text-base"
                    htmlFor={nameInSchema}
                    >
                    {nameInSchema}
                    </FormLabel>
                    <FormControl>
                        <Textarea
                            id={nameInSchema}
                            className={`disabled:text-blue-500 dark:disabled:text-yellow-300 disabled:opacity-75 ${className}`}
                            {...props}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage></FormMessage>
                </FormItem>
            )}
            
        >
        </FormField>

    )
}