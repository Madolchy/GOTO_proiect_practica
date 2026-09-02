import type { LatLng } from '@goto/domain';

export function getGeolocation(navigator: Navigator): Promise<LatLng | undefined> {
	return new Promise((resolve) => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
			},
			(err) => {
				console.warn('[geolocation] failed, keeping default:', err.message);
				resolve(undefined);
			},
			{ enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 }
		);
	});
}
