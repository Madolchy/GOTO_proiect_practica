import { Module } from '@nestjs/common';
import { RabbitModule } from '../rabbit/rabbit.module';
import { DispatchController } from './dispatch.controller';
import { DispatchService } from './dispatch.service';
import { DriverPositionsModule } from 'src/driver-positions/driver-positions.module';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Module({
    imports: [RabbitModule, DriverPositionsModule],
    controllers: [DispatchController],
    providers: [DispatchService],
    exports: [DispatchService]
})
export class DispatchModule {}
