import { Module } from '@nestjs/common';
import { RidepriceModule } from '../rideprice.module';
import { RidePriceGrpcController } from './rideprice-grpc.controller';

@Module({
    imports: [RidepriceModule],
    controllers: [RidePriceGrpcController],
})
export class RidepriceGrpcModule {}
