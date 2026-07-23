import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DispatchWSGateway } from './dispatchws.gateway';
import { RideEventsController } from './ride-events.controller';
import { RabbitModule } from 'src/rabbit/rabbit.module';

@Module({
    imports: [
        RabbitModule,
        ClientsModule.register([
            {
                name: 'RIDE_EVENTS',
                transport: Transport.REDIS,
                options: { host: 'localhost', port: 6379 },
            },
        ]),
    ],
    controllers: [RideEventsController],
    providers: [DispatchWSGateway],
})
export class DispatchWSModule {}