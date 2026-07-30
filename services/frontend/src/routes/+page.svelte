<script lang="ts">
	import { onMount } from 'svelte';
	import LeafletMap from '$lib/LeafletMap.svelte';
	import { getMarkers, addMarker } from '$lib/stores/markers.svelte';
	import ConfirmationModal from '$lib/MarkerModal.svelte';
	import { getGeolocation } from '$lib/utils/location';
	import { toDriverMarkers } from '$lib/utils/markers';
	import { drivers } from '$lib/stores/drivers.svelte';

	// Shown immediately. Recentered to the visitor's real position once
	// the browser geolocation API resolves (requires user permission).
	let center = $state<{ lat: number; lng: number }>({ lat: 44.4268, lng: 26.1025 });

	onMount(async () => {
		if (navigator.geolocation) {
			const coords = await getGeolocation(navigator);
			if (coords) center = coords;
		}

		const names = ['Alice', 'Bob', 'Carol', 'Dan'];
		const jitter = (range: number) => (Math.random() - 0.5) * 2 * range;
		for (let i = 0; i < 4; i++) {
			drivers.activeDrivers.set(`test-${i}`, {
				id: `test-${i}`,
				name: names[i] ?? `Driver ${i}`,
				lat: center.lat + jitter(0.01),
				lng: center.lng + jitter(0.01)
			});
		}
	});

	const markers = getMarkers();
	const driverMarkers = $derived(toDriverMarkers(drivers.activeDrivers));
</script>

<div class="flex h-screen w-full">
	<LeafletMap {center} {markers} {driverMarkers} onMapClick={addMarker} class="h-full flex-1" />

	<!-- <aside class="flex w-80 flex-col gap-4 overflow-auto p-4">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-semibold">Markers</h2>
			<button
				type="button"
				onclick={clearMarkers}
				class="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300"
			>
				Clear
			</button>
		</div>

		<LeafletMarkerContainer class="flex flex-col gap-1">
			{#each markers as latlng (`${latlng.lat},${latlng.lng}`)}
				<LeafletMarker {latlng} />
			{/each}
		</LeafletMarkerContainer>
	</aside> -->

	<ConfirmationModal />
</div>
