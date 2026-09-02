import { createClient, type Client } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { DISPATCH_BACKEND_URL } from '$app/env/public';
import { DriverPositionService } from '@goto/proto/connect/driver_location_pb';
import { uuidv7 } from 'uuidv7';
import type { LatLng } from '@goto/domain';
import { getActivePosition } from './markers.svelte';
import { socket } from './socket.svelte';
import { clientPositionStore } from './ride.svelte';

export type DriverState = 'disconnected' | 'connecting' | 'connected' | 'en_route' | 'transit' | 'error';

type DriverClient = Client<typeof DriverPositionService>;

let client: DriverClient | undefined;
let lastReadOrigin = $state<LatLng | null>(null);
let status = $state<DriverState>('disconnected');
let pingTimer: ReturnType<typeof setTimeout> | null = null;

const PING_INTERVAL_MS = 2000;
const driverId = uuidv7();

export function getDriverId() {
	return driverId;
}

export function getStatus() {
	return status;
}

export function getLastReadOrigin() {
	return lastReadOrigin;
}

export function startRide() {
	if (status === 'connected' || status === 'connecting') status = 'en_route';
}

export function cancelRide() {
	if (status === 'en_route') status = 'connected';
}

export async function pickupClient() {
	if (status !== 'en_route') return;

	const result = await socket.emitWithAck('ride:pickup', {});
	console.log('Result is: ', result);
	if (!result?.ok) return;
	status = 'transit';
}

export async function completRide() {
	if (status !== 'transit') return;

	const result = await socket.emitWithAck('ride:completed', {});
	console.log('Result is: ', result);
	if (!result?.ok) return;

	clientPositionStore.clear();
	status = 'connected';
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
			return null;
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

	lastReadOrigin = latlng;

	try {
		console.log('Driver id is: ', getDriverId());
		if (socket.connected) socket.emit('driver:heartbeat');
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

	socket.connect();
	status = 'connecting';
	const c = getClient();

	void pingLoop(c);
}

export function disconnectDriver() {
	if (status !== 'connected') return;
	if (pingTimer !== null) {
		clearTimeout(pingTimer);
		pingTimer = null;
	}

	socket.disconnect();
	status = 'disconnected';
}
