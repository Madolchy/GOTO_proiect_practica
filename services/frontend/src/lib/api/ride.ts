import { COORDINATOR_BACKEND_URL } from '$app/env/public';
import type { LatLng } from '$lib/stores/markers.svelte';

export async function requestRide(params: {
    userId: string
	origin: LatLng;
	destination: LatLng;
}) {
	const response = await fetch(COORDINATOR_BACKEND_URL + '/dispatch/ride', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(params)
	});

	if (!response.ok) throw new Error('Error during request: ' + response.status);

    return response.json();
}
