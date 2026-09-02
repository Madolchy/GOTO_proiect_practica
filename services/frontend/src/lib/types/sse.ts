import type { LatLng } from '@goto/domain';

export type Driver = { id: string; name: string } & LatLng;
export type DriverList = Array<{ driverId: string; position: LatLng }>;
export type RideStatus =
	'idle' | 'searching' | 'driver_assigned' | 'en_route' | 'picked-up' | 'completed' | 'cancelled';
export type Ride = { status: RideStatus; rideId?: string; driverId?: string };

export type SseEvents = {
	'driver.update': Driver;
	'driver.list': DriverList;
	'ride.found': Ride;
	'ride.pickup': Ride;
	'ride.complet': Ride;
	'ride.failed': Ride;
};

export const SSE_EVENTS_NAMES = [
	'driver.update',
	'driver.list',
	'ride.found',
	'ride.pickup',
	'ride.complet',
	'ride.failed'
] as const;
