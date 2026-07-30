import { Injectable, Logger } from '@nestjs/common';
import { ConnectError, Code, ServiceImpl } from '@connectrpc/connect';
import type { LatLng } from '../gen/common_pb';
import { RedisService } from 'src/redis/redis.service';
import * as proto from '../gen/driver_location_pb';

@Injectable()
export class DriverPositionsService {
    private readonly logger = new Logger(DriverPositionsService.name);

    constructor(private readonly redis: RedisService) {}

    async findNearbyDrivers(origin: LatLng) {
        return this.redis.client.geoSearchWith(
            `dispatch:drivers`,
            { latitude: origin.lat, longitude: origin.lng },
            { radius: 10, unit: 'km' },
            ['WITHDIST'],
            { SORT: 'ASC' },
        );
    }

    // need to validate lat and lng based on redis
    async setPosition(req: proto.SetPositionRequest) {
        if (!req.driverId) throw new ConnectError('driver_id is required', Code.InvalidArgument);
        if (!req.position) throw new ConnectError('position is required', Code.InvalidArgument);

        await this.redis.client.geoAdd(`dispatch:drivers`, {
            latitude: req.position.lat,
            longitude: req.position.lng,
            member: String(req.driverId),
        });

        this.logger.log(`setPosition: driverId=${req.driverId} lat=${req.position?.lat}, lng=${req.position?.lng}`);

        return { ok: true };
    }
}
