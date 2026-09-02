import { Injectable, Logger } from '@nestjs/common';
import { DispatchRiderDto } from './dto/dispatch-rider.dto';
import { uuidv7 } from 'uuidv7';
import { UsersRepository } from 'src/drizzle/users.repository';

@Injectable()
export class DispatchRestService {
    private readonly logger = new Logger(DispatchRestService.name);

    constructor(private readonly users: UsersRepository) {}

    async requestRide(dto: DispatchRiderDto) {
        const newRideId = uuidv7();

        // TEMP: redis version commented out, outbox relay not built yet
        // const userRideKey = `coordinator:ride:${dto.userId}`;
        // const existingRideId = await this.redis.client.set(userRideKey, newRideId, {
        //     condition: 'NX',
        //     expiration: { type: 'EX', value: 600 },
        //     GET: true,
        // });

        const claimed = await this.users.claimRide(dto.userId, newRideId, {
            eventType: 'ride.requested',
            payload: {
                rideId: newRideId,
                userId: dto.userId,
                origin: dto.origin,
                destination: dto.destination,
            },
        });

        if (claimed.isExisting) {
            this.logger.log(`User ${dto.userId} already has active ride: ${claimed.rideId}`);
            return { rideId: claimed.rideId, isExisting: true };
        }

        return { rideId: newRideId, status: 'searching' };
    }
}
