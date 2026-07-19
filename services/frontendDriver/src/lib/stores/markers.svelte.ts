export type LatLng = { lat: number; lng: number };

let driverPosition = $state<LatLng>();
const driverId = $state(Math.floor(100000 + Math.random() * 900000));

export function getDriverId() {
    return driverId
}

export function getActivePosition() {
	return driverPosition;
}

export function updateActivePosition(latlng: LatLng) {
    driverPosition = latlng;
}
