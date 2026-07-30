import type { Driver } from '$lib/types/sse';
import { SvelteMap } from 'svelte/reactivity';
import type { SseClient } from './sse.svelte';

class DriverStore {
	activeDrivers = $state(new SvelteMap<string, Driver>());

	private cleanup: (() => void) | null = null;

	init(sse: SseClient) {
		if (this.cleanup) return;

		this.cleanup = sse.on('driver.update', (driver) => {
			this.activeDrivers.set(driver.id, driver);
		});
	}

	destroy() {
		this.cleanup?.();
		this.cleanup = null;
		this.activeDrivers.clear();
	}
}

export const drivers = new DriverStore();
