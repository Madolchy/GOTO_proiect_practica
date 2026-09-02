import type { LatLng } from '@goto/domain';

let driverPosition = $state<LatLng>();

export function getActivePosition() {
	return driverPosition;
}

export function updateActivePosition(latlng: LatLng) {
	driverPosition = latlng;
}
