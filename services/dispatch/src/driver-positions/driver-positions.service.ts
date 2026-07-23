import { Injectable, Logger } from '@nestjs/common';
import { ConnectError, Code } from '@connectrpc/connect';
import type { LatLng } from '../gen/common_pb';
import type { SetPositionRequest } from '../gen/driver_location_pb';

@Injectable()
export class DriverPositionsService {
    private readonly logger = new Logger(DriverPositionsService.name);
    private readonly positions = new Map<number, LatLng>();

    getPositions() {
        return this.positions;
    }
    setPosition(req: SetPositionRequest): { ok: boolean } {
        if (!req.driverId) throw new ConnectError('driver_id is required', Code.InvalidArgument);
        if (!req.position) throw new ConnectError('position is required', Code.InvalidArgument);

        this.logger.log(`setPosition: driverId=${req.driverId} lat=${req.position?.lat}, lng=${req.position?.lng}`);
        this.positions.set(req.driverId, req.position);

        return { ok: true };
    }
}
