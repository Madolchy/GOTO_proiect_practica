import L from 'leaflet';
import type { MapMarker } from './markers';

export function syncMarkers(
	layer: L.Map,
	incoming: MapMarker[],
	cache: Map<string, L.Marker>
) {
	const next = new Map(incoming.map((m) => [m.id, m]));

	for (const [id, marker] of cache) {
		if (!next.has(id)) {
			marker.remove();
			cache.delete(id);
		}
	}

	for (const [id, m] of next) {
		const existing = cache.get(id);
		if (existing) {
			existing.setLatLng([m.lat, m.lng]);
			if (m.icon) existing.setIcon(m.icon);
		} else {
			cache.set(
				id,
				L.marker([m.lat, m.lng], m.icon ? { icon: m.icon } : {}).addTo(layer)
			);
		}
	}
}
