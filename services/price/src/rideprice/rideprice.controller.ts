import { Controller, Post, Body } from '@nestjs/common';
import { ComputeRidePriceDto } from './dto/compute-ride-price';
import { RidePriceService } from './rideprice.service';

@Controller('rideprice')
export class RidePriceController {
    constructor(private readonly ridePriceService: RidePriceService) {}

    @Post()
    computeRidePrice(@Body() body: ComputeRidePriceDto) {
        const { startlatlng, endlatlng } = body;

        const finalPrice = this.ridePriceService.computePrice(
            startlatlng,
            endlatlng,
        );

        return { price: finalPrice, currency: 'RON' };
    }
}
