import { Module } from '@nestjs/common';
import { RabbitModule } from '../rabbit/rabbit.module';
import { DispatchController } from './dispatch.controller';
import { DispatchService } from './dispatch.service';
import { DriverPositionsModule } from 'src/driver-positions/driver-positions.module';

@Module({
    imports: [RabbitModule, DriverPositionsModule],
    controllers: [DispatchController],
    providers: [DispatchService],
})
export class DispatchModule {}