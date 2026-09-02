import type { Driver } from '$lib/types/sse';
import { SvelteMap } from 'svelte/reactivity';
import type { SseClient } from './sse.svelte';

class DriverStore {
	activeDrivers = $state(new SvelteMap<string, Driver>());

	private cleanup: Array<() => void> = [];

	init(sse: SseClient) {
		if (this.cleanup.length > 0) return;

		this.cleanup.push(
			sse.on('driver.update', (driver) => {
				this.activeDrivers.set(driver.id, driver);
			})
		);
		this.cleanup.push(
			sse.on('driver.list', (driverList) => {
				if (!driverList || driverList.length === 0) return;

				driverList.forEach((driver) => {
					this.activeDrivers.set(driver.driverId, {
						id: driver.driverId,
						name: '',
						...driver.position
					});
				});
			})
		);
	}

	destroy() {
		this.cleanup.forEach((fn) => fn());
		this.cleanup = [];
		this.activeDrivers.clear();
	}
}

export const drivers = new DriverStore();
