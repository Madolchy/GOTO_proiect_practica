import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';

import { DrizzleService } from './drizzle.service';
import { OutboxRepository, OutboxEventType, OutboxPayload } from './outbox.repository';
import { usersTable } from './schema';

@Injectable()
export class UsersRepository {
    constructor(
        private readonly drizzle: DrizzleService,
        private readonly outbox: OutboxRepository,
    ) {}

    async claimRide(userId: string, rideId: string, event: { eventType: OutboxEventType; payload: OutboxPayload }) {
        return this.drizzle.db.transaction(async (tx) => {
            // one atomic statement — the ON CONFLICT clause IS the "user already has a ride" check
            const claimed = await tx
                .insert(usersTable)
                .values({ id: userId, rideId, status: 'searching' })
                .onConflictDoUpdate({
                    target: usersTable.id,
                    set: { rideId, status: 'searching', updatedAt: sql`now()` },
                    where: eq(usersTable.status, 'idle'),
                })
                .returning({ rideId: usersTable.rideId });

            if (claimed.length > 0) {
                await this.outbox.insert(tx, event.eventType, userId, event.payload);
                return { rideId: claimed[0].rideId!, isExisting: false };
            }

            // row exists with an active status → user already has this ride
            const existing = await tx
                .select({ rideId: usersTable.rideId, status: usersTable.status })
                .from(usersTable)
                .where(eq(usersTable.id, userId))
                .limit(1);

            return { rideId: existing[0].rideId, status: existing[0].status, isExisting: true };
        });
    }

    // replaces: hGet coordinator:ride:${rideId} userId  (used by SSE)
    async getUserIdByRideId(rideId: string) {
        const rows = await this.drizzle.db.select({ userId: usersTable.id }).from(usersTable).where(eq(usersTable.rideId, rideId)).limit(1);

        return rows[0]?.userId;
    }

    async completeRide(rideId: string) {
        const updated = await this.drizzle.db
            .update(usersTable)
            .set({ status: 'idle', rideId: null, updatedAt: sql`now()` })
            .where(eq(usersTable.rideId, rideId))
            .returning({ id: usersTable.id });

        return updated.length > 0;
    }

    async cancelRide(rideId: string) {
        const updated = await this.drizzle.db
            .update(usersTable)
            .set({ status: 'cancelled', rideId: null, updatedAt: sql`now()` })
            .where(eq(usersTable.rideId, rideId))
            .returning({ id: usersTable.id });

        return updated.length > 0;
    }
}
