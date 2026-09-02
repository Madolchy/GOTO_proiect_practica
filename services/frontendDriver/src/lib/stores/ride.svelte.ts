import type { RideLocations } from '@goto/domain';

class ClientPositionStore {
	value = $state<RideLocations | null>(null);

	get position() {
		return this.value;
	}

	setClientPosition(origin: RideLocations['origin'], destination: RideLocations['destination']) {
		this.value = { origin, destination };
	}

	clear() {
		this.value = null;
	}
}

export const clientPositionStore = new ClientPositionStore();
