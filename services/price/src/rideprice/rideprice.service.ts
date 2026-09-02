import { getDistance } from 'geolib';
import { Injectable } from '@nestjs/common';
import type { LatLng } from '@goto/domain';

@Injectable()
export class RidePriceService {
    private ronPriceMeter = 0.01;

    computePriceRaw(startlatlng: LatLng, endlatlng: LatLng): number {
        const distance = getDistance(startlatlng, endlatlng); // meters
        return Math.round(distance * this.ronPriceMeter * 100) / 100;
    }

    computePrice(startlatlng: LatLng, endlatlng: LatLng): string {
        const raw = this.computePriceRaw(startlatlng, endlatlng);
        return Intl.NumberFormat('ro-RO', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }).format(raw);
    }
}
