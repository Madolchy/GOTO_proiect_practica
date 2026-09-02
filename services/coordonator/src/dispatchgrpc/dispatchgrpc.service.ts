import { Inject, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import * as m from '@nestjs/microservices';
import type { DriverPositionServiceClient, GetPositionsResponse } from '@goto/proto/nest/driver_location';
import { firstValueFrom } from 'rxjs';
import { DispatchSSEService } from '../dispatchsse/dispatchsse.service';

const DRIVER_POSITION_POLL_INTERVAL_MS = 5_000;

@Injectable()
export class DispatchGrpcService {
    private readonly logger = new Logger(DispatchGrpcService.name);
    private readonly driverPositionService: DriverPositionServiceClient;

    constructor(
        @Inject('DISPATCH_GRPC') private readonly client: m.ClientGrpc,
        private readonly sseService: DispatchSSEService,
    ) {
        this.driverPositionService = this.client.getService<DriverPositionServiceClient>('DriverPositionService');
    }

    @Interval(DRIVER_POSITION_POLL_INTERVAL_MS)
    async pollDriverPositions(): Promise<GetPositionsResponse | undefined> {
        try {
            const response = await firstValueFrom(this.driverPositionService.getPositions({}));
            this.logger.log(`The response object is: ${JSON.stringify(response.driver)}`);
            this.logger.log(`Received ${response.driver.length} driver positions`);

            if (response.driver.length > 0) {
                this.sseService.pushAll(response.driver);
            }

            return response;
        } catch (error) {
            this.logger.error('Failed to fetch driver positions', error instanceof Error ? error.stack : String(error));
        }
    }
}
