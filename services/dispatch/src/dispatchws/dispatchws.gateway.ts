import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LatLng, LatLngSchema } from 'src/gen/common_pb';
import { RedisService } from 'src/redis/redis.service';
import { DispatchWSService } from './dispatchws.service';

@WebSocketGateway({
    namespace: '/live-driver',
    cors: {
        origin: '*',
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: false,
    },
})
export class DispatchWSGateway implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket> {
    private readonly logger = new Logger(DispatchWSGateway.name);

    constructor(
        private readonly amqp: AmqpConnection,
        private readonly redis: RedisService,
        private readonly dispatchWSService: DispatchWSService,
    ) {}

    @WebSocketServer() server: Server;

    async handleConnection(client: Socket, ...args: any[]) {
        if (client.recovered) return;

        const driver = client.handshake.auth?.token as string | undefined; // socket.io has any which eslint complains about
        if (!driver) client.disconnect();
        // const driver = await AUTH CHECK
        //

        console.log('Driver connected to channel: ', `driver:${driver}`);
        client.data.driverId = driver;
        await client.join(`driver:${driver}`);
    }

    handleDisconnect(client: any) {
        console.log('Driver disconnected from channel');
    }

    sendOfferToDriver(rideId: string, driverId: string, origin: LatLng, destination: LatLng) {
        console.log('Sending offer to driver! : ', { rideId, origin: origin, destination: destination });
        this.server.to(`driver:${driverId}`).emit('ride:offer', {
            rideId,
            clientOrigin: origin,
            clientDestination: destination,
        });
    }

    // here we'd check the driver token to be sure
    @SubscribeMessage('ride:accept')
    async handleAccept(@MessageBody() { rideId }: { rideId: string }, @ConnectedSocket() client: Socket) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const driverId = client.data.driverId as string | undefined;
        if (!rideId || !driverId) {
            this.logger.warn('Driver attempted to accept without a rideId or driverId.');
            return;
        }

        const isValidRide = await this.dispatchWSService.isValidRide(driverId, rideId);
        if (!isValidRide) return;

        await this.dispatchWSService.tryRemoveLock(driverId, rideId);

        await this.amqp.publish('ride.events', 'driver.found', { rideId, driverId });
    }

    @SubscribeMessage('ride:declined')
    handleDecline(@MessageBody() { rideId }: { rideId: string }, @ConnectedSocket() client: Socket) {
        console.log('wow ride got declined!!!');
    }

    @SubscribeMessage('ride:pickup')
    handlePickup(@MessageBody() { msg }: any, @ConnectedSocket() client: Socket) {
        console.log('wow rider accepted the pickup');
    }
}
