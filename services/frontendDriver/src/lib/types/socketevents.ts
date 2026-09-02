import type { RideOffer } from '@goto/domain';

export type SocketEvents = {
	'ride:offer': RideOffer;
	'ride:accept': { rideId: string };
	'ride:declined': { rideId: string };
	'ride:pickup': any;
	'ride:completed': any;
	'driver:heartbeat': undefined;
};

export const WEBSOCKET_EVENTS = ['ride:offer', 'ride:accept', 'ride:declined', 'ride:pickup', 'ride:completed'] as const;
