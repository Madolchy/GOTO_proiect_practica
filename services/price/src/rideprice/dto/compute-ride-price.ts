import {
    IsNotEmpty,
    IsDecimal,
    ValidateNested,
    IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LatLngDto {
    @IsNotEmpty()
    @IsDecimal({ decimal_digits: '2,6', force_decimal: true })
    lat: string;

    @IsNotEmpty()
    @IsDecimal({ decimal_digits: '2,6', force_decimal: true })
    lng: string;
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
