<script lang="ts">
	import { onMount } from 'svelte';
	import { LeafletMap } from '@goto/map';
	import type { LatLng } from '@goto/domain';
	import { getMarkers, addMarker } from '$lib/stores/markers.svelte';
	import ConfirmationModal from '$lib/MarkerModal.svelte';
	import { getGeolocation } from '$lib/utils/location';
	import { toDriverMarkers } from '$lib/utils/markers';
	import { drivers } from '$lib/stores/drivers.svelte';

	let center = $state<LatLng>({ lat: 44.4268, lng: 26.1025 });

	onMount(async () => {
		if (navigator.geolocation) {
			const coords = await getGeolocation(navigator);
			if (coords) center = coords;
		}
	});

	const markers = getMarkers();
	const driverMarkers = $derived(toDriverMarkers(Array.from(drivers.activeDrivers.values())));
</script>

<div class="flex h-screen w-full">
	<LeafletMap {center} {markers} {driverMarkers} onMapClick={addMarker} class="h-full flex-1" />
	<ConfirmationModal />
</div>
