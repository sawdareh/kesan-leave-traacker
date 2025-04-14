
import { pgTable, serial, varchar,timestamp,date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"; // Fixed typo: 'Relation' -> 'relations'
import { integer } from "drizzle-orm/pg-core"; // Fixed typo: 'gel-core' -> 'pg-core'


export const employee = pgTable("employee", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(), 
    email: varchar("email").unique().notNull(),
    phone: varchar("phone").unique().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const trackertypes = pgTable("trackertypes", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(), 
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const trackers = pgTable("trackers", {
    id: serial("id").primaryKey(),
    employeeId:integer("employee_id").notNull().references(()=>employee.id),
    trackertypeId:integer("trackertype_id").notNull().references(()=>trackertypes.id),
    date: date("date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});



export const employeeRelations = relations(employee, ({ many }) => ({
    trackers: many(trackers),
  }));
  
  export const trackertypeRelations = relations(trackertypes, ({ many }) => ({
    trackers: many(trackers),
  }));
  

export const trackersRelations = relations(trackers, ({ one }) => ({
    employee: one(employee, {
      fields: [trackers.employeeId],
      references: [employee.id],
    }),
    trackertypes: one(trackertypes, {
      fields: [trackers.trackertypeId],
      references: [trackertypes.id],
    }),
  }));
  