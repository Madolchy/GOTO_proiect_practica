import { getDistance } from 'geolib';
import { LatLngDto } from './dto/compute-ride-price';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RidePriceService {
    private ronPriceMeter = 0.01;

    computePrice(startlatlng: LatLngDto, endlatlng: LatLngDto) {
        const distance = getDistance(startlatlng, endlatlng); // meters
        const price = Intl.NumberFormat('ro-RO', {
            maximumFractionDigits: 2,
        }).format(distance * this.ronPriceMeter);

        return price;
    }
}
