import { Module } from '@nestjs/common';
import { RabbitModule } from '../rabbit/rabbit.module';
import { DispatchRabbitController } from './dispatchrabbit.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    controllers: [DispatchRabbitController],
})
export class DispatchRabbitModule {}
