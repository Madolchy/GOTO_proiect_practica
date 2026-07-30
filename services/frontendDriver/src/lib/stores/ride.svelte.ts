import type { LatLng } from "./markers.svelte";

class ClientPositionStore {
	value = $state<{ origin: LatLng; destination: LatLng } | null>(null);

	get position() {
		return this.value;
	}

	setClientPosition(origin: LatLng, destination: LatLng) {
		this.value = { origin, destination };
	}
}

export const clientPositionStore = new ClientPositionStore();
