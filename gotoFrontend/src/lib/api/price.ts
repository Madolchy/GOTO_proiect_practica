import type { LatLng } from "$lib/stores/markers.svelte";
import { apiGet } from "./client";

export async function getRidePrice(from: LatLng, to: LatLng) {
    // const res = await apiGet('/prices', {
    //     method: 'POST',
    //     headers: { 'content-type': 'application/json' },
    //     body: JSON.stringify({from, to})
    // })

    return {price: 200.0, currency: "RON"}
    // return res.json();
}
