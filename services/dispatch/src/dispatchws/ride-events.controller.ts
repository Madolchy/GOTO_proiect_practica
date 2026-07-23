import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { DispatchWSGateway } from './dispatchws.gateway';
import { LatLng } from 'src/gen/common_pb';

@Controller()
export class RideEventsController {
    constructor(private readonly gateway: DispatchWSGateway) {}

    @EventPattern('ride.offer.created', Transport.REDIS)
    handleOfferCreated(
        @Payload()
        data: {
            rideId: string;
            userId: string;
            driverId: string;
            clientOrigin: LatLng;
            clientDestination: LatLng;
        },
    ) {
        console.log('heyo?', data);
        this.gateway.sendOfferToDriver(
            data.rideId,
            data.driverId,
            data.clientOrigin,
            data.clientDestination,
        );
    }
}