import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';
import { isUUID } from 'class-validator';
import {
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { LatLng } from '@goto/domain';
import { driverTable } from 'src/drizzle/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';
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
        private readonly drizzle: DrizzleService,
        private readonly dispatchWSService: DispatchWSService,
    ) {}

    @WebSocketServer() server: Server;

    async handleConnection(client: Socket, ...args: any[]) {
        const driver = client.handshake.auth?.token as string | undefined; // socket.io has any which eslint complains about
        if (!driver || !isUUID(driver, 'all')) {
            client.disconnect();
            return;
        }

        client.conn.on('heartbeat', () => {
            this.logger.log(`Received pong from driver ${driver}`);
            this.dispatchWSService.setDriverOnline(driver).catch((err) =>
                this.logger.error(`Failed to refresh driver online for ${driver}: ${err.message}`),
            );
        });

        client.data.driverId = driver;

        // this is for development, before auth
        await this.drizzle.db.insert(driverTable).values({ id: driver, status: 'pending' }).onConflictDoNothing();

        if (!client.recovered) await client.join(`driver:${driver}`);

        await this.dispatchWSService.setDriverOnline(driver);

        this.logger.log('Driver connected to channel: ', `driver:${driver}`);
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
    // happy path: Transaction succesds + ack
    // neutral path: Trasaction success + fail ack
    private async handleRideAction(
        client: Socket,
        action: (rideId: string, driverId: string) => Promise<boolean>,
        routingKey: string,
        failureReason?: string,
        successPayload?: (rideId: string) => Record<string, unknown>,
    ) {
        const driverId = client.data.driverId as string | undefined;
        if (!driverId) {
            this.logger.warn('Driver attempted an action without a driverId.');
            return;
        }

        const ride = await this.dispatchWSService.getAssignedRide(driverId);
        if (!ride) return { ok: false, reason: 'no_assigned_ride' };

        const ok = await action(ride.id, driverId);
        if (!ok) return { ok: false, reason: failureReason };

        await this.amqp.publish('ride.events', routingKey, { rideId: ride.id, driverId });
        return { ok: true, ...successPayload?.(ride.id) };
    }

    @SubscribeMessage('ride:accept')
    async handleAccept(@ConnectedSocket() client: Socket) {
        return this.handleRideAction(
            client,
            (rideId, driverId) => this.dispatchWSService.acceptRide(rideId, driverId),
            'driver.found',
            'offer_expired_or_taken',
            (rideId) => ({ rideId, status: 'en-route' }),
        );
    }

    @SubscribeMessage('ride:declined')
    async handleDecline(@ConnectedSocket() client: Socket) {
        return this.handleRideAction(
            client,
            (rideId, driverId) => this.dispatchWSService.declineRide(rideId, driverId),
            'driver.declined',
        );
    }

    @SubscribeMessage('ride:pickup')
    async handlePickup(@ConnectedSocket() client: Socket) {
        return this.handleRideAction(
            client,
            (rideId, driverId) => this.dispatchWSService.pickupRide(rideId, driverId),
            'driver.pickup',
        );
    }

    @SubscribeMessage('ride:completed')
    async handleComplet(@ConnectedSocket() client: Socket) {
        return this.handleRideAction(
            client,
            (rideId, driverId) => this.dispatchWSService.completRide(rideId, driverId),
            'driver.complet',
        );
    }
}
