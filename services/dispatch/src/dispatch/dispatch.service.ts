import { Injectable } from '@nestjs/common';
import { getDistance } from 'geolib';
import { DriverPositionsService } from 'src/driver-positions/driver-positions.service';
import { LatLng } from 'src/gen/common_pb';

@Injectable()
export class DispatchService {
    constructor(private readonly driverPositionService: DriverPositionsService) {}

    findDriver(clientOrigin: LatLng, clientDestination: LatLng) {
        const drivers = this.driverPositionService.getPositions();
        if (!drivers) throw new Error('No available drivers');

        let bestDriver: { id: number; distanceToClient: number } | null = null;
        for (const [id, driverOrigin] of drivers) {
            const distanceToClient = getDistance(clientOrigin, driverOrigin);

            if (!bestDriver || distanceToClient < bestDriver.distanceToClient) {
                bestDriver = { id, distanceToClient };
            }
        }

        return bestDriver!.id;
    }
}
