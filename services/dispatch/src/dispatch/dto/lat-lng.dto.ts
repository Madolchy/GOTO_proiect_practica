import { IsNumber, Max, Min } from 'class-validator';
import type { LatLng } from '@goto/domain';

export class LatLngDto implements LatLng {
    @IsNumber()
    @Min(-90)
    @Max(90)
    lat: number;

    @IsNumber()
    @Min(-180)
    @Max(180)
    lng: number;
}
