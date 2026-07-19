export type LatLng = { lat: number; lng: number };
const MARKER_EPSILON = 0.0001;

const items = $state<LatLng[]>([]);

export function getMarkers() {
	return items;
}

export function addMarker(latlng: LatLng) {
	// make sure markers are not too close to each other
	if (
		items.some(
			(m) =>
				Math.abs(m.lat - latlng.lat) < MARKER_EPSILON &&
				Math.abs(m.lng - latlng.lng) < MARKER_EPSILON
		)
	)
		return;

	items.push(latlng);
}

export function removeMarker(index: number) {
	items.splice(index, 1);
}

export function clearMarkers() {
	items.length = 0;
}
