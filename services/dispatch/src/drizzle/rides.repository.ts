import { Injectable } from '@nestjs/common';
import { and, eq, gt, inArray, sql } from 'drizzle-orm';
import type { SQLWrapper } from 'drizzle-orm';

import { DispatchTransaction, DrizzleService } from './drizzle.service';
import { DriversRepository } from './drivers.repository';
import { offeredTable, Ride, ridesTable } from './schema';

@Injectable()
export class RidesRepository {
    constructor(
        private readonly drizzle: DrizzleService,
        private readonly drivers: DriversRepository,
    ) {}

    async getRides(tx: DispatchTransaction, status: Ride['status'], condition?: SQLWrapper) {
        return tx
            .select()
            .from(ridesTable)
            .where(and(eq(ridesTable.status, status), condition))
            .limit(50)
            .for('update', { skipLocked: true });
    }

    async findActiveByDriver(driverId: string) {
        const rows = await this.drizzle.db
            .select({ id: ridesTable.id, status: ridesTable.status })
            .from(ridesTable)
            .where(and(eq(ridesTable.assignedDriverId, driverId), inArray(ridesTable.status, ['offered', 'en-route', 'picked-up'])))
            .limit(1);

        return rows[0];
    }

    async getOfferedDrivers(tx: DispatchTransaction, rideIds: string[]) {
        return tx
            .select({ rideId: offeredTable.rideId, driverId: offeredTable.driverId })
            .from(offeredTable)
            .where(inArray(offeredTable.rideId, rideIds));
    }

    async getAskedDriversByRide(tx: DispatchTransaction, rideIds: string[]) {
        const rows = await tx
            .select({ rideId: offeredTable.rideId, driverId: offeredTable.driverId })
            .from(offeredTable)
            .where(inArray(offeredTable.rideId, rideIds));

        const asked = new Map<string, Set<string>>();
        for (const { rideId, driverId } of rows) {
            let set = asked.get(rideId);
            if (!set) {
                set = new Set();
                asked.set(rideId, set);
            }
            set.add(driverId);
        }
        return asked;
    }

    async offerRide(tx: DispatchTransaction, rideId: string, driverId: string) {
        const offered = await tx
            .update(ridesTable)
            .set({
                status: 'offered',
                assignedDriverId: driverId,
                assignedExpireAt: sql`now() + interval '30 seconds'`,
            })
            .where(and(eq(ridesTable.id, rideId), eq(ridesTable.status, 'pending')))
            .returning({ id: ridesTable.id });
        if (offered.length === 0) return 0;

        await tx.insert(offeredTable).values({ rideId, driverId }).onConflictDoNothing();
        return offered.length;
    }

    async cancel(tx: DispatchTransaction, rideId: string) {
        const cancelled = await tx
            .update(ridesTable)
            .set({ status: 'cancelled', assignedDriverId: null, assignedExpireAt: null })
            .where(and(eq(ridesTable.id, rideId), eq(ridesTable.status, 'pending')))
            .returning({ id: ridesTable.id });

        return cancelled.length;
    }

    async delete(tx: DispatchTransaction, rideId: string) {
        const deleted = await tx
            .delete(ridesTable)
            .where(and(eq(ridesTable.id, rideId), eq(ridesTable.status, 'cancelled')))
            .returning({ id: ridesTable.id });

        return deleted.length;
    }

    async release(tx: DispatchTransaction, rideId: string) {
        const released = await tx
            .update(ridesTable)
            .set({ status: 'pending', assignedDriverId: null, assignedExpireAt: null })
            .where(and(eq(ridesTable.id, rideId), eq(ridesTable.status, 'offered')))
            .returning({ id: ridesTable.id });

        return released.length;
    }

    async accept(rideId: string, driverId: string) {
        return this.drizzle.db.transaction(async (tx) => {
            const ride = await tx
                .update(ridesTable)
                .set({ status: 'en-route', assignedExpireAt: null })
                .where(
                    and(
                        eq(ridesTable.id, rideId),
                        eq(ridesTable.status, 'offered'),
                        eq(ridesTable.assignedDriverId, driverId),
                        gt(ridesTable.assignedExpireAt, sql`now()`),
                    ),
                )
                .returning({ id: ridesTable.id });
            if (ride.length === 0) return false; // expired, not your ride, or cleanup won

            await this.drivers.updateState(tx, driverId, 'offered', 'en-route');
            return true;
        });
    }

    async decline(rideId: string, driverId: string) {
        return this.drizzle.db.transaction(async (tx) => {
            const ride = await tx
                .update(ridesTable)
                .set({ status: 'pending', assignedDriverId: null, assignedExpireAt: null })
                .where(and(eq(ridesTable.id, rideId), eq(ridesTable.status, 'offered'), eq(ridesTable.assignedDriverId, driverId)))
                .returning({ id: ridesTable.id });
            if (ride.length === 0) return false;

            await this.drivers.updateState(tx, driverId, 'offered', 'pending');
            return true;
        });
    }

    async pickup(rideId: string, driverId: string) {
        return this.drizzle.db.transaction(async (tx) => {
            const updated = await tx
                .update(ridesTable)
                .set({ status: 'picked-up' })
                .where(and(eq(ridesTable.id, rideId), eq(ridesTable.status, 'en-route'), eq(ridesTable.assignedDriverId, driverId)))
                .returning({ id: ridesTable.id });

            if (updated.length === 0) return false;
            await this.drivers.updateState(tx, driverId, 'en-route', 'picked-up');
            return true;
        });
    }

    async complet(rideId: string, driverId: string) {
        return this.drizzle.db.transaction(async (tx) => {
            const updated = await tx
                .update(ridesTable)
                .set({ status: 'complet', assignedDriverId: null, assignedExpireAt: null })
                .where(and(eq(ridesTable.id, rideId), eq(ridesTable.status, 'picked-up'), eq(ridesTable.assignedDriverId, driverId)))
                .returning({ id: ridesTable.id });

            if (updated.length === 0) return false;
            const driverUpdated = await this.drivers.updateState(tx, driverId, 'picked-up', 'pending');
            if (!driverUpdated) {
                throw new Error(`Driver ${driverId} was not in picked-up state when completing ride ${rideId}`);
            }

            return true;
        });
    }
}
