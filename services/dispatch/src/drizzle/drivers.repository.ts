
import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { DispatchTransaction } from './drizzle.service';
import { driverTable, Ride } from './schema';

@Injectable()
export class DriversRepository {
    async updateState(tx: DispatchTransaction, driverId: string, oldStatus: Ride['status'], newStatus: Ride['status']) {
        const updated = await tx
            .update(driverTable)
            .set({ status: newStatus })
            .where(and(eq(driverTable.id, driverId), eq(driverTable.status, oldStatus)))
            .returning({ id: driverTable.id });

        return updated.length;
    }
}
