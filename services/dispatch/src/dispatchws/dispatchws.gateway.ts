import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
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
    constructor(
        @Inject('RIDE_EVENTS') private redis: ClientProxy,
        private readonly amqp: AmqpConnection,
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

    @SubscribeMessage('ride:accept')
    async handleAccept(@MessageBody() { rideId }: { rideId: string }, @ConnectedSocket() client: Socket) {
        console.log('wow ride got accepted!!!');
        const driverId = client.data.driverId as string | undefined;
        if (!rideId || !driverId) return;
        await this.amqp.publish('ride.events', 'driver.found', { rideId, driverId });
    }

    @SubscribeMessage('ride:declined')
    handleDecline(@MessageBody() { rideId }: { rideId: string }, @ConnectedSocket() client: Socket) {
        console.log('wow ride got declined!!!');
    }
}