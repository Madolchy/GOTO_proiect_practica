import { Controller, OnModuleInit, Sse, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { DispatchSSEService } from './dispatchsse.service';
import { RedisService } from 'src/redis/redis.service';
import { UsersRepository } from 'src/drizzle/users.repository';

@Controller('dispatch')
export class DispatchSSEController implements OnModuleInit {
    constructor(
        private readonly sseService: DispatchSSEService,
        private readonly redis: RedisService,
        private readonly users: UsersRepository,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.redis.subscriber.subscribe('ride.found', async (raw) => {
            const msg = JSON.parse(raw) as { rideId: string; driverId: string };
            console.log('Found driver! Sending to client frontend');
            const userId = await this.users.getUserIdByRideId(msg.rideId);
            if (!userId) return;
            this.sseService.push(userId, { rideId: msg.rideId, driverId: msg.driverId, status: 'driver_assigned' }, 'ride.found');
        });

        await this.redis.subscriber.subscribe('ride.complet', async (raw) => {
            const msg = JSON.parse(raw) as { rideId: string; driverId: string };
            console.log('Ride completed! Sending feedback event to client frontend');
            const userId = await this.users.getUserIdByRideId(msg.rideId);
            if (!userId) return;
            this.sseService.push(userId, { rideId: msg.rideId, driverId: msg.driverId, status: 'completed' }, 'ride.complet');
            await this.users.completeRide(msg.rideId);
        });

        await this.redis.subscriber.subscribe('ride.failed', async (raw) => {
            const msg = JSON.parse(raw) as { rideId: string; userId: string };
            console.log('Ride failed! Sending failure event to client frontend');
            const userId = await this.users.getUserIdByRideId(msg.rideId);
            if (!userId) return;
            this.sseService.push(userId, { rideId: msg.rideId, status: 'cancelled' }, 'ride.failed');
            await this.users.cancelRide(msg.rideId);
        });
    }

    @Sse('sse/:userId')
    sse(@Param('userId') userId: string): Observable<MessageEvent> {
        // need to add auth check
        return this.sseService.subscribe(userId);
    }
}
