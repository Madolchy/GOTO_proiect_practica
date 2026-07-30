import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class DispatchWSService {
    private readonly logger = new Logger(DispatchWSService.name);

    constructor(
        private readonly amqp: AmqpConnection,
        private readonly redis: RedisService,
    ) {}

    // replace with redis lua for true transaction
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

    async tryRemoveLock(driverId: string, rideId: string) {
        const driverRideId = await this.redis.client.get(`dispatch:driver:${driverId}:lock`);
        if (rideId !== driverRideId) {
            this.logger.warn(`Failed to remove lock for ${driverId}, lock does not match expected value: ${driverRideId} `);
            return false;
        }

        const result = await this.redis.client.del(`dispatch:driver:${driverId}:lock`);
        if (!result) {
            this.logger.error(`Failed to remove lock for ${driverId}`);
            return false;
        }

        return true;
    }
}
