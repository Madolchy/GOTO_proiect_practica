import { getDistance } from 'geolib';
import { LatLngDto } from './dto/compute-ride-price';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RidePriceService {
    private ronPriceMeter = 0.01;

    computePriceRaw(startlatlng: LatLngDto, endlatlng: LatLngDto): number {
        const distance = getDistance(startlatlng, endlatlng); // meters
        return Math.round(distance * this.ronPriceMeter * 100) / 100;
    }

    computePrice(startlatlng: LatLngDto, endlatlng: LatLngDto): string {
        const raw = this.computePriceRaw(startlatlng, endlatlng);
        return Intl.NumberFormat('ro-RO', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }).format(raw);
    }
}
