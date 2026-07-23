import { IsNumber, Min, Max, ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

export class LatLngDto {
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
