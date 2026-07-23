import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RidePriceService } from '../rideprice.service';
import * as price from './gen/proto/price';

@Controller()
export class RidePriceGrpcController {
    constructor(private readonly ridePriceService: RidePriceService) {}

    @GrpcMethod('PriceService', 'GetPrice')
    getPrice(data: price.GetPriceRequest): price.GetPriceResponse {
        const raw = this.ridePriceService.computePriceRaw(
            data.origin!,
            data.destination!,
        );
        return { price: raw, currency: 'RON' };
    }
}
