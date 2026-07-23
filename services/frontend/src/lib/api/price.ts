import { COORDINATOR_BACKEND_URL } from '$app/env/public';
import type { LatLng } from '$lib/stores/markers.svelte';

export async function getRidePrice(from: LatLng, to: LatLng) {
    const body = JSON.stringify({ origin: from, destination: to });

	const response = await fetch(COORDINATOR_BACKEND_URL + '/price', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: body
	});

	const data = await response.json();
    console.log('ride info: ' + body);
	console.log('price: ', data);
	return data;
}
