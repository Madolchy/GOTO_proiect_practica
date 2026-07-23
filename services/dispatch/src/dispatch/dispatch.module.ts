import { Module } from '@nestjs/common';
import { RabbitModule } from '../rabbit/rabbit.module';
import { DispatchController } from './dispatch.controller';
import { DispatchService } from './dispatch.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DriverPositionsModule } from 'src/driver-positions/driver-positions.module';

@Module({
    imports: [
        RabbitModule,
        DriverPositionsModule,
        ClientsModule.register([
            {
                name: 'RIDE_EVENTS',
                transport: Transport.REDIS,
                options: { host: 'localhost', port: 6379 },
            },
        ]),
    ],
    controllers: [DispatchController],
    providers: [DispatchService],
})
export class DispatchModule {}