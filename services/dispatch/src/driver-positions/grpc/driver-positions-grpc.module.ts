import { Module } from '@nestjs/common';
import { DriverPositionsModule } from '../driver-positions.module';
import { DriverPositionsGrpcController } from './driver-positions-grpc.controller';

@Module({
    imports: [DriverPositionsModule],
    controllers: [DriverPositionsGrpcController],
})
export class DriverPositionsGrpcModule {}
