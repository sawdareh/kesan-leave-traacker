
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { employee } from "@/db/schema"

export const insertEmployeeSchema = createInsertSchema(
    employee, {
        name: (schema) => schema.min(1, "Employee is required"),
        email: (schema) => schema.email("Invalid email address"),
        phone: (schema) => schema.regex(/^\d{3}-\d{3}-\d{4}$/, "Invalid phone number format. Use XXX-XXX-XXXX"),
    }
)

export const selectEmployeeSchema = createSelectSchema(employee);

export type insertEmployeeSchemaType = typeof insertEmployeeSchema._type;
export type selectEmployeeSchemaType = typeof selectEmployeeSchema._type;