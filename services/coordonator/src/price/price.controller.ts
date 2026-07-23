import { Body, Controller, Post } from '@nestjs/common';
import { PriceService } from './price.service';
import { GetPriceDto } from './dto/get-price.dto';

@Controller('price')
export class PriceController {
    constructor(private readonly priceService: PriceService) {}

    @Post()
    getPrice(@Body() body: GetPriceDto) {
        return this.priceService.getPrice(body.origin, body.destination);
    }
}
