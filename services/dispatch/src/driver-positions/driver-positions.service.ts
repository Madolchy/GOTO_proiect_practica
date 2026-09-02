import { Injectable, Logger } from '@nestjs/common';
import { ConnectError, Code, ServiceImpl } from '@connectrpc/connect';
import type { LatLng } from '@goto/domain';
import { RedisService } from 'src/redis/redis.service';
import type * as proto from '@goto/proto/connect/driver_location_pb';

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

    async findAllDriversWithPositions() {
        const results = await this.redis.client.geoSearchWith(
            `dispatch:drivers`,
            { latitude: 0, longitude: 0 },
            { radius: 22000, unit: 'km' },
            ['WITHCOORD'],
            { SORT: 'ASC' },
        );

        return results.flatMap((driver) => {
            if (!driver.coordinates) return [];

            return [
                {
                    driverId: driver.member,
                    position: {
                        lat: Number(driver.coordinates.latitude),
                        lng: Number(driver.coordinates.longitude),
                    },
                },
            ];
        });
    }
    // need to validate lat and lng based on redis
    async setPosition(req: proto.SetPositionRequest) {
        if (!req.driverId) throw new ConnectError('driver_id is required', Code.InvalidArgument);
        if (!req.position) throw new ConnectError('position is required', Code.InvalidArgument);

        const online = await this.redis.client.exists(`driver:online:${req.driverId}`);
        if (!online) {
            this.logger.debug(`Ignoring position update for offline driver ${req.driverId}`);
            return { ok: false };
        }

        await this.redis.client.geoAdd(`dispatch:drivers`, {
            latitude: req.position.lat,
            longitude: req.position.lng,
            member: String(req.driverId),
        });

        this.logger.log(`setPosition: driverId=${req.driverId} lat=${req.position?.lat}, lng=${req.position?.lng}`);

        return { ok: true };
    }
}
