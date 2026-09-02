import { Injectable } from '@nestjs/common';
import { and, eq, lt, sql } from 'drizzle-orm';

import { CoordinatorTransaction, DrizzleService } from './drizzle.service';
import { outboxTable } from './schema';

export type OutboxEventType = typeof outboxTable.$inferInsert.eventType;

export type OutboxPayload = {
    rideId: string;
    userId: string;
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
};

@Injectable()
export class OutboxRepository {
    constructor(private readonly drizzle: DrizzleService) {}

    // called inside the claim transaction — atomic with the user state write
    async insert(tx: CoordinatorTransaction, eventType: OutboxEventType, aggregateId: string, payload: OutboxPayload) {
        await tx.insert(outboxTable).values({
            aggregateId,
            eventType,
            payload,
        });
    }

    // called inside the relay transaction — locks held until commit, SKIP LOCKED meaningful
    async getPending(tx: CoordinatorTransaction, limit = 50) {
        return tx
            .select()
            .from(outboxTable)
            .where(eq(outboxTable.status, 'pending'))
            .orderBy(outboxTable.id)
            .limit(limit)
            .for('update', { skipLocked: true });
    }

    async markPublished(tx: CoordinatorTransaction, id: string) {
        const updated = await tx
            .update(outboxTable)
            .set({ status: 'published', publishedAt: sql`now()` })
            .where(and(eq(outboxTable.id, id), eq(outboxTable.status, 'pending')))
            .returning({ id: outboxTable.id });

        return updated.length > 0;
    }

    // ops/standalone — no tx needed
    async markFailed(id: string) {
        const updated = await this.drizzle.db
            .update(outboxTable)
            .set({ status: 'failed' })
            .where(eq(outboxTable.id, id))
            .returning({ id: outboxTable.id });

        return updated.length > 0;
    }

    async deletePublishedOlderThan(hours = 24) {
        const deleted = await this.drizzle.db
            .delete(outboxTable)
            .where(
                and(
                    eq(outboxTable.status, 'published'),
                    lt(outboxTable.createdAt, sql`now() - interval '1 hour' * ${hours}`),
                ),
            )
            .returning({ id: outboxTable.id });

        return deleted.length;
    }
}
