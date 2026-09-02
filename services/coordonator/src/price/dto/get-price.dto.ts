import { IsNumber, Min, Max, ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
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

export class GetPriceDto {
    @ValidateNested()
    @Type(() => LatLngDto)
    @IsDefined()
    origin: LatLngDto;

    @ValidateNested()
    @Type(() => LatLngDto)
    @IsDefined()
    destination: LatLngDto;
}
