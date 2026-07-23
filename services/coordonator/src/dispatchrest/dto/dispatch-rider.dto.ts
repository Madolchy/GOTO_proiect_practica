import {
    IsNotEmpty,
    IsString,
    ValidateNested,
    IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LatLngDto } from '../../price/dto/get-price.dto';

export class DispatchRiderDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ValidateNested()
    @Type(() => LatLngDto)
    @IsDefined()
    origin: LatLngDto;

    @ValidateNested()
    @Type(() => LatLngDto)
    @IsDefined()
    destination: LatLngDto;
}
