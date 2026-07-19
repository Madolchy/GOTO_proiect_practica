import { Module } from '@nestjs/common';
import { RidePriceController } from './rideprice.controller';
import { RidePriceService } from './rideprice.service';

@Module({
    controllers: [RidePriceController],
    providers: [RidePriceService],
})
export class RidepriceModule {}
