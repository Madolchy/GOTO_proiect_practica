import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { DriverPositionsService } from '../driver-positions.service';
import type * as driverLocation from '@goto/proto/nest/driver_location';

@Controller()
export class DriverPositionsGrpcController {
    private readonly logger = new Logger(DriverPositionsGrpcController.name);
    constructor(private readonly driverPositionsService: DriverPositionsService) {}

    @GrpcMethod('DriverPositionService', 'GetPositions')
    async getPositions(_request: driverLocation.GetPositionsRequest): Promise<driverLocation.GetPositionsResponse> {
        const drivers = await this.driverPositionsService.findAllDriversWithPositions();
        this.logger.log(`Returning ${drivers.length} driver positions`);

        return { driver: drivers };
    }
}
