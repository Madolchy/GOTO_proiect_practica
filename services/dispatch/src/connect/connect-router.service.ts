import { Injectable } from '@nestjs/common';
import type { ConnectRouter } from '@connectrpc/connect';
import { DriverPositionService } from '../gen/driver_location_pb';
import { DriverPositionsService } from '../driver-positions/driver-positions.service';

@Injectable()
export class ConnectRouterService {
    constructor(private readonly driverPositionsService: DriverPositionsService) {}

    register(router: ConnectRouter): void {
        router.service(DriverPositionService, this.driverPositionsService);
    }
}
