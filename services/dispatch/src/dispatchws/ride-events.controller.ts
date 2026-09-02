import { Controller, OnModuleInit } from '@nestjs/common';
import { DispatchWSGateway } from './dispatchws.gateway';
import { RedisService } from 'src/redis/redis.service';
import { LatLng } from '@goto/proto/connect/common_pb';

@Controller()
export class RideEventsController implements OnModuleInit {
    constructor(
        private readonly gateway: DispatchWSGateway,
        private readonly redis: RedisService,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.redis.subscriber.subscribe('ride.offer.created', (raw) => {
            const data = JSON.parse(raw) as {
                rideId: string;
                userId: string;
                driverId: string;
                clientOrigin: LatLng;
                clientDestination: LatLng;
            };
            this.gateway.sendOfferToDriver(data.rideId, data.driverId, data.clientOrigin, data.clientDestination);
        });
    }
}
