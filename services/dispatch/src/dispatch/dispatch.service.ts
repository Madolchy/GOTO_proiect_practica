import { createDeadlineSignal } from '@connectrpc/connect/protocol';
import { Injectable, Logger } from '@nestjs/common';
import { getDistance } from 'geolib';
import { RedisArgument, SetOptions } from 'redis';
import { DriverPositionsService } from 'src/driver-positions/driver-positions.service';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { ridesTable } from 'src/drizzle/schema';
import { CreateRideDto } from './dto/create-ride.dto';
import { RedisService } from 'src/redis/redis.service';
import { eq } from 'drizzle-orm';
import type { LatLng } from '@goto/domain';

@Injectable()
export class DispatchService {
    private readonly logger = new Logger(DispatchService.name);

    constructor(
        private readonly driverPositionService: DriverPositionsService,
        private readonly redis: RedisService,
        private readonly drizzle: DrizzleService,
    ) {}

    async matchDriversForRide(clientOrigin: LatLng) {
        return await this.driverPositionService.findNearbyDrivers(clientOrigin);
    }

    // async tryLock(key: RedisArgument, val: RedisArgument, options: SetOptions) {
    //     const lock = await this.redis.client.set(key, val, options);
    //     if (lock !== 'OK') {
    //         this.logger.warn(`Failed to set a lock on: ${key} with value: ${val}`);
    //         return false;
    //     }

    //     return true;
    // }

    // async findDriverForRide(rideId: string, userId: string, origin: LatLng, destination: LatLng) {
    //     const nearbyDrivers = await this.matchDriversForRide(origin, destination);
    //     if (!nearbyDrivers || nearbyDrivers.length === 0) {
    //         this.logger.warn(`Found no drivers suitable for ride: ${rideId}`);
    //         return;
    //     }

    // const bestDriver = nearbyDrivers[0].member;

    // // convert to redis lua script, switch to db for safe
    // const driverLock = await this.tryLock(`dispatch:driver:${bestDriver}`, String(rideId), {
    //     condition: 'NX',
    //     expiration: { type: 'EX', value: 30 },
    // });

    // if (!driverLock) return;
    // const rideLock = await this.tryLock(`dispatch:ride:${rideId}:lock`, String(bestDriver), {
    //     condition: 'NX',
    //     expiration: { type: 'EX', value: 30 },
    // });

    // if (!rideLock) return;

    // return bestDriver;
    // }

    async createRide(dto: CreateRideDto): Promise<boolean> {
        const inserted = await this.drizzle.db
            .insert(ridesTable)
            .values(dto.toInsert())
            .onConflictDoNothing()
            .returning({ id: ridesTable.id });

        if (inserted.length === 0) {
            this.logger.log(`Ride ${dto.rideId} already exists, skipping`);
            return false;
        }

        return true;
    }


}
