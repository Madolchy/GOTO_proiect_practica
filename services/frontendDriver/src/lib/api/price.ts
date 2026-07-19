import { PRICE_BACKEND_URL } from '$app/env/public';
import type { LatLng } from '$lib/stores/markers.svelte';

export async function getRidePrice(from: LatLng, to: LatLng) {
	const response = await fetch(PRICE_BACKEND_URL + '/rideprice', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ startlatlng: from, endlatlng: to })
	});

	const data = await response.json();
	console.log("ride info: " + JSON.stringify({ startlatlng: from, endlatlng: to }));
    console.log("price: ", data);
	return data;
}
