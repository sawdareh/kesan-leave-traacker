
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
  
    startTime: () =>
        z
          .string()
          .nonempty("Start time is required")
          .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
      
    endTime: () =>
        z
          .string()
          .nonempty("End time is required")
          .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
      
    })
    

export const seletTrackerSchema=createSelectSchema(trackers)

export type insertTrackerSchemaType=typeof insertTrackerSchema._type;
export type selectTrackerSchemaType=typeof seletTrackerSchema._type;