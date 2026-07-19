import { createClient, type Client } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { DISPATCH_BACKEND_URL, PRICE_BACKEND_URL } from '$app/env/public';
import { DriverPositionService } from '../../gen/driver_location_pb';
import { getActivePosition, getDriverId, updateActivePosition, type LatLng } from './markers.svelte';

type DriverState = 'disconnected' | 'connecting' | 'connected' | 'error';

type DriverClient = Client<typeof DriverPositionService>;

let client: DriverClient | undefined;
let status = $state<DriverState>('disconnected');
let pingTimer: ReturnType<typeof setTimeout> | null = null;

const PING_INTERVAL_MS = 2000;

export function getStatus() {
	return status;
}

function getClient(): DriverClient {
	if (!client) {
		const transport = createConnectTransport({ baseUrl: DISPATCH_BACKEND_URL });
		client = createClient(DriverPositionService, transport);
	}
	return client;
}

// Wraps the one-shot getCurrentPosition in a Promise so we can await it.
function readGpsOnce(): Promise<LatLng | null> {
	return new Promise((resolve) => {
		if (!navigator.geolocation) {
			resolve(null);
			return;
		}

        const driverPosition = getActivePosition();
        if (!driverPosition) {
            resolve(null);
            return null
        }

        const latlng = resolve(driverPosition);
        return latlng;
		// this is gps version, for development we'll use marker
		// navigator.geolocation.getCurrentPosition(
		// 	(pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
		// 	(err) => {
		// 		console.error('[gps]', err.message);
		// 		resolve(null);
		// 	},
		// 	{ enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 }
		// );
	});
}

async function pingOnce(c: DriverClient): Promise<void> {
	const latlng = await readGpsOnce();
	if (!latlng) return;

	try {
        console.log("Driver id is: ", getDriverId())
		await c.setPosition({ driverId: getDriverId(), position: latlng });
		if (status === 'connecting') status = 'connected';
	} catch (err) {
		console.error('[driver] setPosition upload failed:', err);
	}
}

async function pingLoop(driver: DriverClient): Promise<void> {
	await pingOnce(driver);
	pingTimer = setTimeout(() => void pingLoop(driver), PING_INTERVAL_MS);
}

export async function connectDriver() {
	if (status !== 'disconnected') return;
	if (!navigator.geolocation) {
		status = 'error';
		console.error('[driver] geolocation not supported by this browser');
		return;
	}

	status = 'connecting';
	const c = getClient();

	void pingLoop(c);
}

export function disconnectDriver() {
	if (pingTimer !== null) {
		clearTimeout(pingTimer);
		pingTimer = null;
	}
	status = 'disconnected';
}
