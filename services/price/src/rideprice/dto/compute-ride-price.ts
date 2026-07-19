import {
    IsNotEmpty,
    IsNumber,
    ValidateNested,
    IsDefined,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

const toFixed6 = ({ value }: { value: number }) =>
    Math.round(value * 1_000_000) / 1_000_000;

export class LatLngDto {
    @Transform(toFixed6)
    @IsNotEmpty()
    @IsNumber()
    lat: number;

    @Transform(toFixed6)
    @IsNotEmpty()
    @IsNumber()
    lng: number;
}

export class ComputeRidePriceDto {
    @ValidateNested()
    @Type(() => LatLngDto) // Tells class-transformer how to instantiate the inner object
    @IsDefined()
    startlatlng: LatLngDto;

    @ValidateNested()
    @Type(() => LatLngDto)
    @IsDefined()
    endlatlng: LatLngDto;
}
