import { Controller, Post, Body} from '@nestjs/common';
import { DispatchRiderDto } from './dto/dispatch-rider.dto';
import { DispatchRestService } from './dispatchrest.service';

@Controller('dispatch')
export class DispatchRestController {
    constructor(private readonly rideDispatchService: DispatchRestService) {}

    @Post('ride')
    async dispatchRider(@Body() dto: DispatchRiderDto) {
        return await this.rideDispatchService.requestRide(dto);
    }
}
