import { Controller, Inject } from '@nestjs/common';
import { RabbitSubscribe, AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class DispatchRabbitController {
    constructor(
        private amqp: AmqpConnection,
        @Inject('RIDE_EVENTS') private redis: ClientProxy,
    ) {}

    @RabbitSubscribe({
        exchange: 'ride.events',
        routingKey: 'driver.found',
        queue: 'coordinator.driver.found',
        queueOptions: {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': 'ride.dlx',
                'x-dead-letter-routing-key': 'coordinator.driver.found',
            },
        },
    })
    onDriverFound(msg: { rideId: string; driverId: string }) {
        console.log('Received onDriverFround message! sending to redis');
        this.redis.emit('driver.found', msg);
    }

    @RabbitSubscribe({
        exchange: 'ride.dlx',
        routingKey: 'coordinator.driver.found',
        queue: 'coordinator.failures',
        queueOptions: { durable: true },
    })
    async onDriverFoundFailed(msg: any) {
        // mark workflow failed, compensate
    }
}
