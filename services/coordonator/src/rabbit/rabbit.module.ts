import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
    imports: [
        RabbitMQModule.forRoot({
            uri: 'amqp://guest:guest@localhost:5672',
            enableControllerDiscovery: true,
            exchanges: [
                { name: 'ride.commands', type: 'direct' },
                { name: 'ride.events', type: 'direct' },
                { name: 'ride.dlx', type: 'direct' },
            ],
        }),
    ],
    exports: [RabbitMQModule],
})
export class RabbitModule {}
