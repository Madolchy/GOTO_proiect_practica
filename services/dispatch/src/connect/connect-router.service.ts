import { Injectable } from '@nestjs/common';
import type { ConnectRouter } from '@connectrpc/connect';
import { DriverPositionService } from '../gen/driver_location_pb';
import { DriverPositionsService } from '../driver-positions/driver-positions.service';

/**
 * Central registration of all Connect-RPC services.
 *
 * Add new services here as they are introduced; the `ConnectModule` exports
 * this service so `main.ts` can mount the Connect adapter once the Nest
 * container is ready.
 */
@Injectable()
export class ConnectRouterService {
    constructor(
        private readonly driverPositionsService: DriverPositionsService,
    ) {}

    register(router: ConnectRouter): void {
        router.service(DriverPositionService, this.driverPositionsService);
    }
}
