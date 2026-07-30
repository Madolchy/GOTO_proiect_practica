import type L from 'leaflet';
import { driverIcon } from '$lib/icons/driverIcon';
import type { Driver } from '$lib/types/sse';

export type MapMarker = {
	id: string;
	lat: number;
	lng: number;
	icon?: L.DivIcon | L.Icon;
};

export function toDriverMarkers(drivers: Map<string, Driver>): MapMarker[] {
	return [...drivers.values()].map((d) => ({
		id: d.id,
		lat: d.lat,
		lng: d.lng,
		icon: driverIcon
	}));
}
