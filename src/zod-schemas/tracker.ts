
import { trackers } from "@/db/schema";
import { createInsertSchema,createSelectSchema } from "drizzle-zod";
import {z} from "zod"

export const insertTrackerSchema = createInsertSchema(trackers, {
    id: z.union([z.number(), z.literal("(New)")]),
    employeeId: z
      .union([z.number(), z.string().min(1)])
      .refine((val) => val !== "" && val !== null && val !== undefined, {
        message: "Employee Name is required",
      }),
  
    trackertypeId: z
      .union([z.number(), z.string().min(1)])
      .refine((val) => val !== "" && val !== null && val !== undefined, {
        message: "Tracker Name is required",
      }),
  
    date: () =>
      z
        .string()
        .nonempty("Date is required")
        .refine((val) => !isNaN(new Date(val).getTime()), {
          message: "Invalid date",
        })
        .transform((val) => new Date(val).toISOString().split("T")[0]),
    })
    

export const seletTrackerSchema=createSelectSchema(trackers)

export type insertTrackerSchemaType=typeof insertTrackerSchema._type;
export type selectTrackerSchemaType=typeof seletTrackerSchema._type;