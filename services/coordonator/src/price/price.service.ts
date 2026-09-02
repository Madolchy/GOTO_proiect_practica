import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { PriceServiceClient } from '@goto/proto/nest/price';
import type { LatLng } from '@goto/proto/nest/common';
import * as m from '@nestjs/microservices';

@Injectable()
export class PriceService implements OnModuleInit {
    private priceService: PriceServiceClient;

    constructor(@Inject('PRICE_PACKAGE') private client: m.ClientGrpc) {}

    onModuleInit() {
        this.priceService = this.client.getService<PriceServiceClient>('PriceService');
    }

    getPrice(origin: LatLng, destination: LatLng) {
        return this.priceService.getPrice({
            origin,
            destination,
        });
    }
}
