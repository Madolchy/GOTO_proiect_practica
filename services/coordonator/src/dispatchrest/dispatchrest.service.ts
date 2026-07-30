import { Injectable, Logger } from '@nestjs/common';
import { DispatchRiderDto } from './dto/dispatch-rider.dto';
import { RedisService } from 'src/redis/redis.service';
import { uuidv7 } from 'uuidv7';
import { RideStatus } from 'src/types/status';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class DispatchRestService {
    private readonly logger = new Logger(DispatchRestService.name);

    constructor(
        private readonly redis: RedisService,
        private readonly amqp: AmqpConnection,
    ) {}

    async requestRide(dto: DispatchRiderDto) {
        const userRideKey = `coordinator:ride:${dto.userId}`;
        const newRideId = uuidv7();

        const existingRideId = await this.redis.client.set(userRideKey, newRideId, {
            condition: 'NX',
            expiration: { type: 'EX', value: 600 },
            GET: true,
        });

        if (existingRideId) {
            this.logger.log(`User ${dto.userId} already has active ride: ${existingRideId}`);
            return { rideId: existingRideId, isExisting: true };
        }

        return this.createNewRideState(newRideId, dto);
    }

    private async createNewRideState(rideId: string, dto: DispatchRiderDto) {
        // multi write so we will need outbox box in future
        await this.redis.client.hSet(`coordinator:ride:${rideId}`, {
            userId: dto.userId,
            rideId,
            status: 'searching' as RideStatus,
        });

        // AMQP Publish
        await this.amqp.publish('ride.commands', 'find-driver', {
            rideId,
            userId: dto.userId,
            origin: dto.origin,
            destination: dto.destination,
        });

        return { rideId, status: 'searching' };
    }
}
