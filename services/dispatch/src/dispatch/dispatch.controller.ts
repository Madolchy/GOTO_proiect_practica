import { Controller, Inject } from '@nestjs/common';
import { RabbitSubscribe, AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { DispatchService } from './dispatch.service';
import { ClientProxy } from '@nestjs/microservices';
import { LatLng } from 'src/gen/common_pb';

@Controller()
export class DispatchController {
    constructor(
        private amqp: AmqpConnection,
        private dispatchService: DispatchService,
        @Inject('RIDE_EVENTS') private redis: ClientProxy,
    ) {}

    @RabbitSubscribe({
        exchange: 'ride.commands',
        routingKey: 'find-driver',
        queue: 'find-driver.work',
        queueOptions: {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': 'ride.dlx',
                'x-dead-letter-routing-key': 'find-driver.work',
            },
        },
    })
    onFindDriver(msg: { rideId: string; userId: string; origin: LatLng; destination: LatLng }) {
        console.log('Some bitch ass nigga wants a ride: ', msg.userId, ' with the id: ', msg.rideId);
        console.log('Finding a driver: ');

        const driverId = this.dispatchService.findDriver(msg.origin, msg.destination);
        if (!driverId) return;

        console.log('Found driver! ', driverId);
        this.redis.emit('ride.offer.created', {
            rideId: msg.rideId,
            userId: msg.userId,
            clientOrigin: msg.origin,
            clientDestination: msg.destination,
            driverId: driverId,
        });
        // await this.amqp.publish('ride.events', 'driver.found', {
        //     rideId: driver,
        //     driverId: driver,
        // });
    }
}