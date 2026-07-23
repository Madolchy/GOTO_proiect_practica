import { Controller, Post, Body } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { DispatchRiderDto } from './dto/dispatch-rider.dto';
import { uuidv7 } from 'uuidv7';

@Controller('dispatch')
export class DispatchRestController {
    constructor(private readonly amqp: AmqpConnection) {}

    @Post('ride')
    async dispatchRider(@Body() dto: DispatchRiderDto) {
        const rideId = uuidv7();
        await this.amqp.publish('ride.commands', 'find-driver', {
            rideId,
            userId: dto.userId,
            origin: dto.origin,
            destination: dto.destination,
        });
        return { rideId };
    }
}
