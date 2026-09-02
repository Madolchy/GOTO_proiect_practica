import { customType, index, jsonb, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { RideStatus } from 'src/types/status';

const userStatus = customType<{ data: RideStatus }>({
    dataType() {
        return 'text';
    },
});

const outboxStatus = customType<{ data: 'pending' | 'published' | 'failed' }>({
    dataType() {
        return 'text';
    },
});

const outboxEventType = customType<{ data: 'ride.requested' }>({
    dataType() {
        return 'text';
    },
});

export type UserState = typeof usersTable.$inferSelect;

export const usersTable = pgTable(
    'users',
    {
        id: uuid('id').primaryKey().notNull(), // userId, one row per user
        rideId: uuid('ride_id'),
        status: userStatus('status').notNull().default('idle'),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (t) => [index('users_ride_idx').on(t.rideId)],
);

export const outboxTable = pgTable('outbox', {
    id: uuid('id').primaryKey().notNull().default(sql`uuidv7()`),
    aggregateId: uuid('aggregate_id').notNull(),
    eventType: outboxEventType('event_type').notNull(),
    payload: jsonb('payload').notNull(),
    status: outboxStatus('status').notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
});
