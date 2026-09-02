import { BadRequestException, Controller, ValidationPipe } from '@nestjs/common';
import { RabbitSubscribe, RabbitPayload, AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { DispatchService } from './dispatch.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { Channel, Message } from 'amqplib';

@Controller()
export class DispatchController {
    constructor(
        private amqp: AmqpConnection,
        private dispatchService: DispatchService,
        private readonly redis: RedisService,
    ) {}

    @RabbitSubscribe({
        exchange: 'ride.commands',
        routingKey: 'find-driver',
        queue: 'find-driver.work',
        queueOptions: {
            durable: true,
            arguments: {
                'x-queue-type': 'quorum',
                'x-delayed-retry-type': 'all',
                'x-delivery-limit': 5,
                'x-delayed-retry-min': 1000,
                'x-delayed-retry-max': 5000,
                'x-dead-letter-exchange': 'ride.dlx',
                'x-dead-letter-routing-key': 'coordinator.driver.found',
            },
        },
        errorHandler: (channel: Channel, msg: Message, err?: unknown) =>
            // permanent failures (bad payload) -> dead-letter, don't requeue forever
            // transient failures (db down etc.) -> requeue
            channel.reject(msg, !(err instanceof BadRequestException)),
    })
    async onFindDriver(
        @RabbitPayload(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
        dto: CreateRideDto,
    ) {
        console.log('Some bitch ass nigga wants a ride: ', dto.userId, ' with the id: ', dto.rideId);
        console.log('Finding a driver: ');
        const created = await this.dispatchService.createRide(dto);
        if (!created) {
            // duplicate delivery — already recorded, ack quietly
            return;
        }
        // const driverId = await this.dispatchService.findDriverForRide(msg.rideId, msg.userId, msg.origin, msg.destination);
        // const payload = JSON.stringify({
        //     rideId: msg.rideId,
        //     userId: msg.userId,
        //     clientOrigin: msg.origin,
        //     clientDestination: msg.destination,
        //     driverId: driverId,
        // });

        // await this.redis.client
        //     .multi()
        //     .hSet(`dispatch:ride:${msg.rideId}:offer`, {
        //         driverId: String(driverId),
        //         userId: msg.userId,
        //         status: 'offered',
        //     })
        //     .publish('ride.offer.created', payload)
        //     .exec();
    }
}
