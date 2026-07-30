import type { Driver, Ride } from '$lib/types/sse';
import { SvelteMap } from 'svelte/reactivity';
import type { SseClient } from './sse.svelte';

class RideStore {
	private ride = $state<Ride>({ status: 'idle' });
	private cleanup: (() => void) | null = null;

	init(sse: SseClient) {
		if (this.cleanup) return;

		this.cleanup = sse.on('ride.found', (ride) => {
		    console.log("We received a message on the sse ride.found")
			this.ride = ride;
		});
	}

	destroy() {
		this.cleanup?.();
		this.cleanup = null;
		this.ride = null;
	}

	get current() {
		return this.ride;
	}

	setCurrent(ride: Ride) {
		this.ride = ride;
	}
}

export const rideStore = new RideStore();
