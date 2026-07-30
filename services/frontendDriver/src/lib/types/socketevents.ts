import type { LatLng } from '$lib/stores/markers.svelte';

type RideOffer = {
	rideId: string;
	clientOrigin: LatLng;
	clientDestination: LatLng;
};

export type SocketEvents = {
	'ride:offer': RideOffer;
	'ride:accept': { rideId: string };
	'ride:declined': { rideId: string };
	'ride:pickup': any;
};

export const WEBSOCKET_EVENTS = ['ride:offer'] as const;
