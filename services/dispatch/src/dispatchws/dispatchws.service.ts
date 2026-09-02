import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RidesRepository } from 'src/drizzle/rides.repository';
import { RedisService } from 'src/redis/redis.service';
import { DRIVER_RECOVERY_GRACE } from './dispatchws.constants';

@Injectable()
export class DispatchWSService implements OnModuleInit {
    private readonly logger = new Logger(DispatchWSService.name);

    constructor(
        private readonly redis: RedisService,
        private readonly rides: RidesRepository,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.redis.onKeyExpired(async (key) => {
            if (key.startsWith('driver:online:')) {
                const driverId = key.slice('driver:online:'.length);
                this.logger.log(`driver offline grace period expired: ${key}`);
                await this.removeDriverFromDispatch(driverId);
            }
        });
    }

    async setDriverOnline(driverId: string): Promise<void> {
        await this.redis.client.set(`driver:online:${driverId}`, '1', {
            expiration: { type: 'EX', value: DRIVER_RECOVERY_GRACE },
        });
    }

    async setDriverOffline(driverId: string): Promise<void> {
        await this.redis.client.del(`driver:online:${driverId}`);
    }

    async removeDriverFromDispatch(driverId: string): Promise<void> {
        await this.redis.client.zRem(`dispatch:drivers`, driverId);
    }

    // TODO: reconcile with the Postgres offer flow — currently unused by the gateway
    async isValidRide(driverId: string, rideId: string) {
        const driverRideId = await this.redis.client.get(`dispatch:driver:${driverId}:lock`);
        if (!driverRideId) {
            this.logger.warn(`Driver: ${driverId} tried to confirm ride: ${rideId} while lock was gone.`);
            return false;
        }

        if (rideId !== driverRideId) {
            this.logger.warn(`Driver: ${driverId} tried to confirm ride: ${rideId} while their assigned ride was ${driverRideId}`);
            return false;
        }

        return true;
    }

    // async tryRemoveLock(driverId: string, rideId: string) {
    //     const driverRideId = await this.redis.client.get(`dispatch:driver:${driverId}:lock`);
    //     if (rideId !== driverRideId) {
    //         this.logger.warn(`Failed to remove lock for ${driverId}, lock does not match expected value: ${driverRideId} `);
    //         return false;
    //     }

    //     const result = await this.redis.client.del(`dispatch:driver:${driverId}:lock`);
    //     if (!result) {
    //         this.logger.error(`Failed to remove lock for ${driverId}`);
    //         return false;
    //     }

    //     return true;
    // }

    // Resolves the driver's current assigned ride so clients don't send rideId.
    // The repo methods below still enforce the expected status transition.
    async getAssignedRide(driverId: string) {
        const ride = await this.rides.findActiveByDriver(driverId);
        if (!ride) {
            this.logger.warn(`Driver: ${driverId} has no active assigned ride.`);
        }
        return ride;
    }

    acceptRide(rideId: string, driverId: string) {
        return this.rides.accept(rideId, driverId);
    }

    declineRide(rideId: string, driverId: string) {
        return this.rides.decline(rideId, driverId);
    }

    pickupRide(rideId: string, driverId: string) {
        return this.rides.pickup(rideId, driverId);
    }

    completRide(rideId: string, driverId: string) {
        return this.rides.complet(rideId, driverId);
    }
}
