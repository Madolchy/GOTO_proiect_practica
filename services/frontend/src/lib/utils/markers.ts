import type { MapMarker } from '@goto/map';
import { driverIcon } from '$lib/icons/driverIcon';
import type { Driver } from '$lib/types/sse';

export function toDriverMarkers(drivers: Driver[]): MapMarker[] {
	return drivers.map((d) => ({
		id: d.id,
		position: { lat: d.lat, lng: d.lng },
		icon: driverIcon as MapMarker['icon']
	}));
}
