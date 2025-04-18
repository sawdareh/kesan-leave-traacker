import { pgTable, serial, varchar, timestamp, integer,date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Added length for clarity
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const employee = pgTable("employee", {
  id: serial("id").primaryKey(),
  departmentId: integer("department_id").references(() => departments.id), // Remove .nullable()
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const trackertypes = pgTable("trackertypes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const trackers = pgTable("trackers", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employee.id),
  trackertypeId: integer("trackertype_id").notNull().references(() => trackertypes.id),
  leaveDate:date("leave_date").notNull(),
  returnDate:date("return_date").notNull(),
  leaveday:integer("leaveday").notNull(),
  totaltime:varchar("totaltime"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

// Relations
export const departmentsRelations = relations(departments, ({ many }) => ({
  employees: many(employee),
}));

export const employeeRelations = relations(employee, ({ many, one }) => ({
  trackers: many(trackers),
  department: one(departments, {
    fields: [employee.departmentId],
    references: [departments.id],
  }),
}));

export const trackertypeRelations = relations(trackertypes, ({ many }) => ({
  trackers: many(trackers),
}));

export const trackersRelations = relations(trackers, ({ one }) => ({
  employee: one(employee, {
    fields: [trackers.employeeId],
    references: [employee.id],
  }),
  trackertype: one(trackertypes, {
    fields: [trackers.trackertypeId],
    references: [trackertypes.id],
  }),
}));