import { Controller, OnModuleInit, Sse, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { DispatchSSEService } from './dispatchsse.service';
import { RedisService } from 'src/redis/redis.service';

@Controller('dispatch')
export class DispatchSSEController implements OnModuleInit {
    constructor(
        private readonly sseService: DispatchSSEService,
        private readonly redis: RedisService,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.redis.subscriber.subscribe('driver.found', async (raw) => {
            const msg = JSON.parse(raw) as { rideId: string; driverId: string };
            console.log('Found driver! Sending to client frontend');
            const userId = await this.redis.client.hGet(`coordinator:ride:${msg.rideId}`, 'userId');
            console.log('Tried to get the following userId: ', userId);
            if (!userId) return;
            this.sseService.push(userId, { rideId: msg.rideId, driverId: msg.driverId, status: 'driver_assigned' }, 'ride.found');
        });
    }

    @Sse('sse/:userId')
    sse(@Param('userId') userId: string): Observable<MessageEvent> {
        // need to add auth check
        return this.sseService.subscribe(userId);
    }
}
