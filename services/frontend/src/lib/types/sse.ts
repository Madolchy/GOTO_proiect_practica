export type Driver = { id: string; name: string; lat: number; lng: number };
export type RideStatus = 'idle' | 'searching' | 'driver_assigned' | 'en_route' | 'completed' | 'cancelled';
export type Ride = { status: RideStatus; rideId?: string, driverId?: string };

export type SseEvents = {
	'driver.update': Driver;
	'ride.found': Ride;

};

export const SSE_EVENTS_NAMES = ['driver.update', 'ride.found'] as const
