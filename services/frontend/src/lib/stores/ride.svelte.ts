import type { Ride } from '$lib/types/sse';
import type { SseClient } from './sse.svelte';

class RideStore {
	private ride = $state<Ride>({ status: 'idle' });
	private cleanup: Array<() => void> = [];

	private handleRideFound(ride: Ride) {
		console.log('We received a message on the sse ride.found', ride);
		this.ride = { ...this.ride, ...ride, status: 'en_route' };
	}

	private handleRidePickup(ride: Ride) {
		console.log('We received a message on the sse ride.pickup', ride);
		this.ride = { ...this.ride, ...ride, status: 'picked-up' };
	}

	private handleRideComplet(ride: Ride) {
		console.log('We received a message on the sse ride.complet', ride);
		this.ride = { ...this.ride, ...ride, status: 'completed' };
	}

	private handleRideFailed(ride: Ride) {
		console.log('We received a message on the sse ride.failed', ride);
		this.ride = { ...this.ride, ...ride, status: 'cancelled' };
	}

	init(sse: SseClient) {
		this.cleanup.push(sse.on('ride.found', (ride) => this.handleRideFound(ride)));
		this.cleanup.push(sse.on('ride.pickup', (ride) => this.handleRidePickup(ride)));
		this.cleanup.push(sse.on('ride.complet', (ride) => this.handleRideComplet(ride)));
		this.cleanup.push(sse.on('ride.failed', (ride) => this.handleRideFailed(ride)));
	}

	destroy() {
		this.cleanup?.forEach((fn) => fn());
		this.cleanup = [];
		this.ride = { status: 'idle' };
	}

	get current() {
		return this.ride;
	}

	setCurrent(ride: Ride) {
		this.ride = ride;
	}
}

export const rideStore = new RideStore();
