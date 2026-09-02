import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';
import { ridesTable } from 'src/drizzle/schema';
import { LatLngDto } from './lat-lng.dto';
import { sql } from 'drizzle-orm';

export class CreateRideDto {
    @IsUUID()
    rideId: string;

    @IsUUID()
    userId: string;

    @ValidateNested()
    @Type(() => LatLngDto)
    origin: LatLngDto;

    @ValidateNested()
    @Type(() => LatLngDto)
    destination: LatLngDto;

    toInsert(): typeof ridesTable.$inferInsert {
        return {
            id: this.rideId,
            userId: this.userId,
            originLat: this.origin.lat,
            originLng: this.origin.lng,
            destinationLat: this.destination.lat,
            destinationLng: this.destination.lng,
            assignedExpireAt: new Date(Date.now() + 5 * 60 * 1000),
        };
    }
}
