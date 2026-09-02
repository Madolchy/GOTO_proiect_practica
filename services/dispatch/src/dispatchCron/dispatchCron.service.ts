import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lte, sql } from 'drizzle-orm';

import { DispatchService } from 'src/dispatch/dispatch.service';
import { DispatchWSGateway } from 'src/dispatchws/dispatchws.gateway';
import { DispatchTransaction, DrizzleService } from 'src/drizzle/drizzle.service';
import { DriversRepository } from 'src/drizzle/drivers.repository';
import { RidesRepository } from 'src/drizzle/rides.repository';
import { Ride, ridesTable } from 'src/drizzle/schema';
import type { LatLng } from '@goto/domain';

type RideOfferNotification = { rideId: string; driverId: string; origin: LatLng; destination: LatLng };

@Injectable()
export class DispatchCronService {
    private readonly logger = new Logger(DispatchCronService.name);

    constructor(
        private readonly amqp: AmqpConnection,
        private readonly dispatchService: DispatchService,
        private readonly dispatchWSGateway: DispatchWSGateway,
        private readonly drizzle: DrizzleService,
        private readonly drivers: DriversRepository,
        private readonly rides: RidesRepository,
    ) {}

    private async findNextAvaliableDriver(
        rideId: string,
        rideOrigin: LatLng,
        askedDriversByRide: Map<string, Set<string>>,
    ): Promise<{ ok: true; driverId: string } | { ok: false; status: 'NO_DRIVERS' | 'ALL_DRIVERS_OFFERED' }> {
        const drivers = await this.dispatchService.matchDriversForRide(rideOrigin);
        if (!drivers || drivers.length === 0) {
            this.logger.log('No drivers left!');
            return { ok: false, status: 'NO_DRIVERS' };
        }

        const asked = askedDriversByRide.get(rideId);
        const candidates = asked ? drivers.filter((d) => !asked.has(d.member)) : drivers;
        if (candidates.length === 0) {
            this.logger.log(`All nearby drivers already offered ride ${rideId}`);
            return { ok: false, status: 'ALL_DRIVERS_OFFERED' };
        }

        this.logger.log(`Avaliable drivers for ride ${rideId}: `, candidates);
        return { ok: true, driverId: candidates[0].member };
    }

    private async findDriverForRide(
        tx: DispatchTransaction,
        askedDriversByRide: Map<string, Set<string>>,
        ride: Ride,
    ): Promise<RideOfferNotification | undefined> {
        const origin = { lat: ride.originLat, lng: ride.originLng };
        const match = await this.findNextAvaliableDriver(ride.id, origin, askedDriversByRide);
        if (!match.ok) {
            this.logger.log(`No more drivers for ride ${ride.id}, marking as cancelled.`);
            await this.rides.cancel(tx, ride.id);
            return;
        }

        const driverId = match.driverId;
        const claimed = await this.drivers.updateState(tx, driverId, 'pending', 'offered');
        if (!claimed) return;

        const offered = await this.rides.offerRide(tx, ride.id, driverId);
        if (!offered) {
            await this.drivers.updateState(tx, driverId, 'offered', 'pending');
            return;
        }

        return {
            rideId: ride.id,
            driverId,
            origin,
            destination: { lat: ride.destinationLat, lng: ride.destinationLng },
        };
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    async assignPendingRides() {
        const notifications: RideOfferNotification[] = [];

        await this.drizzle.db.transaction(async (tx) => {
            const rides = await this.rides.getRides(tx, 'pending');
            this.logger.log('Grabbed the following rides from cron job: ', rides);
            if (rides.length === 0) return;

            const askedDriversByRide = await this.rides.getAskedDriversByRide(
                tx,
                rides.map((r) => r.id),
            );

            for (const ride of rides) {
                const notification = await this.findDriverForRide(tx, askedDriversByRide, ride);
                if (notification) notifications.push(notification);
            }
        });

        for (const notif of notifications) {
            this.dispatchWSGateway.sendOfferToDriver(notif.rideId, notif.driverId, notif.origin, notif.destination);
        }
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    async notifyCancelledRides() {
        await this.drizzle.db.transaction(async (tx) => {
            const cancelledRides = await this.rides.getRides(tx, 'cancelled');
            if (cancelledRides.length === 0) return;

            this.logger.log('Notifying coordinator about cancelled rides: ', cancelledRides);
            for (const ride of cancelledRides) {
                await this.amqp.publish('ride.events', 'driver.not.found', {
                    rideId: ride.id,
                    userId: ride.userId,
                });
                await this.rides.delete(tx, ride.id);
            }
        });
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    async cleanExpiredOffers() {
        this.logger.log('Running the clean expired offers crone job!');
        await this.drizzle.db.transaction(async (tx) => {
            const expiredRides = await this.rides.getRides(tx, 'offered', lte(ridesTable.assignedExpireAt, sql`now()`));

            this.logger.log('Confirmed expired rides: ', expiredRides);
            for (const ride of expiredRides) {
                await this.rides.release(tx, ride.id);

                if (ride.assignedDriverId) {
                    await this.drivers.updateState(tx, ride.assignedDriverId, 'offered', 'pending');
                }

                this.logger.log(`Expired ride offer cleared: rideId=${ride.id}, driverId=${ride.assignedDriverId ?? 'none'}`);
            }
        });
    }
}
