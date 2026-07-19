import { Injectable, Logger } from '@nestjs/common';
import type { LatLng, SetPositionRequest } from '../gen/driver_location_pb';

@Injectable()
export class DriverPositionsService {
    private readonly logger = new Logger(DriverPositionsService.name);

    setPosition(req: SetPositionRequest): { ok: boolean } {
        this.logger.log(
            `setPosition: driverId=${req.driverId} lat=${req.position?.lat}, lng=${req.position?.lng}`,
        );
        // TODO: persist the driver position.
        return { ok: true };
    }

    // async streamPositions(
    //     requests: AsyncIterable<LatLng>,
    // ): Promise<{ ok: boolean; received: number }> {
    //     let received = 0;
    //     for await (const point of requests) {
    //         received++;
    //         this.logger.debug(
    //             `streamPositions: lat=${point.lat}, lng=${point.lng}`,
    //         );
    //     }
    //     return { ok: true, received };
    // }
}
