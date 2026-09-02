import { customType, doublePrecision, pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';

const status = customType<{ data: 'pending' | 'offered' | 'en-route' | 'picked-up' | 'complet' | 'cancelled' }>({
    dataType() {
        return 'text';
    },
});

export type Ride = typeof ridesTable.$inferSelect;

export const ridesTable = pgTable('rides', {
    id: uuid('id').primaryKey().notNull(),
    userId: uuid('userId').notNull(),
    status: status('status').notNull().default('pending'),
    originLat: doublePrecision('origin_lat').notNull(),
    originLng: doublePrecision('origin_lng').notNull(),
    destinationLat: doublePrecision('destination_lat').notNull(),
    destinationLng: doublePrecision('destination_lng').notNull(),
    assignedDriverId: uuid('assigned_driverId'),
    assignedExpireAt: timestamp('offer_expire_at', { withTimezone: true }),
});

export const driverTable = pgTable('drivers', {
    id: uuid('id').primaryKey().notNull(),
    status: status('status').notNull().default('pending'),
});

export const offeredTable = pgTable(
    'offered',
    {
        rideId: uuid('ride_id')
            .notNull()
            .references(() => ridesTable.id, { onDelete: 'cascade' }),
        driverId: uuid('driver_id')
            .notNull()
            .references(() => driverTable.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (t) => [primaryKey({ columns: [t.rideId, t.driverId] })],
);
