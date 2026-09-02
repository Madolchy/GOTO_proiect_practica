import { Controller } from '@nestjs/common';
import { RabbitSubscribe, AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RedisService } from 'src/redis/redis.service';
import { Channel, Message } from 'amqplib';

@Controller()
export class DispatchRabbitController {
    constructor(
        private amqp: AmqpConnection,
        private readonly redis: RedisService,
    ) {}

    @RabbitSubscribe({
        exchange: 'ride.events',
        routingKey: 'driver.found',
        queue: 'coordinator.driver.found',
        queueOptions: {
            durable: true,
            arguments: {
                'x-queue-type': 'quorum',
                'x-delayed-retry-type': 'all',
                'x-delivery-limit': 5,
                'x-delayed-retry-min': 1000,
                'x-delayed-retry-max': 5000,
                'x-dead-letter-exchange': 'ride.dlx',
                'x-dead-letter-routing-key': 'coordinator.driver.failed',
            },
        },
        errorHandler: (channel: Channel, msg: Message) => channel.reject(msg, true),
    })
    async onDriverFound(msg: { rideId: string; driverId: string }) {
        console.log('Received onDriverFround message! sending to redis');
        await this.redis.client.publish('ride.found', JSON.stringify(msg));
    }

    @RabbitSubscribe({
        exchange: 'ride.events',
        routingKey: 'driver.pickup',
        queue: 'coordinator.driver.pickup',
        queueOptions: {
            durable: true,
            arguments: {
                'x-queue-type': 'quorum',
                'x-delayed-retry-type': 'all',
                'x-delivery-limit': 5,
                'x-delayed-retry-min': 1000,
                'x-delayed-retry-max': 5000,
                'x-dead-letter-exchange': 'ride.dlx',
                'x-dead-letter-routing-key': 'coordinator.driver.failed',
            },
        },
        errorHandler: (channel: Channel, msg: Message) => channel.reject(msg, true),
    })
    async onDriverPickup(msg: { rideId: string; driverId: string }) {
        // TODO: handle pickup
    }

    @RabbitSubscribe({
        exchange: 'ride.events',
        routingKey: 'driver.complet',
        queue: 'coordinator.driver.complet',
        queueOptions: {
            durable: true,
            arguments: {
                'x-queue-type': 'quorum',
                'x-delayed-retry-type': 'all',
                'x-delivery-limit': 5,
                'x-delayed-retry-min': 1000,
                'x-delayed-retry-max': 5000,
                'x-dead-letter-exchange': 'ride.dlx',
                'x-dead-letter-routing-key': 'coordinator.driver.failed',
            },
        },
        errorHandler: (channel: Channel, msg: Message) => channel.reject(msg, true),
    })
    async onDriverComplet(msg: { rideId: string; driverId: string }) {
        console.log('Received driver.complet message! sending to redis');
        await this.redis.client.publish('ride.complet', JSON.stringify(msg));
    }

    @RabbitSubscribe({
        exchange: 'ride.events',
        routingKey: 'driver.not.found',
        queue: 'coordinator.driver.not.found',
        queueOptions: {
            durable: true,
            arguments: {
                'x-queue-type': 'quorum',
                'x-delayed-retry-type': 'all',
                'x-delivery-limit': 5,
                'x-delayed-retry-min': 1000,
                'x-delayed-retry-max': 5000,
                'x-dead-letter-exchange': 'ride.dlx',
                'x-dead-letter-routing-key': 'coordinator.driver.failed',
            },
        },
        errorHandler: (channel: Channel, msg: Message) => channel.reject(msg, true),
    })
    async onDriverNotFound(msg: { rideId: string; userId: string }) {
        console.log('Driver not found! sending failure to redis');
        await this.redis.client.publish('ride.failed', JSON.stringify(msg));
    }

    @RabbitSubscribe({
        exchange: 'ride.dlx',
        routingKey: 'coordinator.driver.failed',
        queue: 'coordinator.failures',
        queueOptions: { durable: true },
    })
    async onDriverFoundFailed(msg: any) {
        console.log('Failed to find a driver in the end i wanna kill mytself');
        // mark workflow failed, compensate
    }
}
