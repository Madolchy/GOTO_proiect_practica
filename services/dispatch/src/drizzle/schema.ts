import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const ridesTable = pgTable('rides', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),

    // id
    // status
    // assigned_driverId
    // assigned_expire_at
});

export const driverTable = pgTable('drivers', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    // ride_status
})
