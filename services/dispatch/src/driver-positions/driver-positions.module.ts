import { Module } from '@nestjs/common';
import { DriverPositionsService } from './driver-positions.service';

@Module({
    providers: [DriverPositionsService],
    exports: [DriverPositionsService],
})
export class DriverPositionsModule {}
