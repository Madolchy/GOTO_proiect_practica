<script lang="ts">
	import { onMount } from 'svelte';
	import LeafletMap from '$lib/LeafletMap.svelte';
	import { getMarkers, addMarker } from '$lib/stores/markers.svelte';
	import MarkerModal from '$lib/MarkerModal.svelte';

	// Shown immediately. Recentered to the visitor's real position once
	// the browser geolocation API resolves (requires user permission).
	let center = $state<{ lat: number; lng: number }>({ lat: 44.4268, lng: 26.1025 });

	onMount(() => {
		if (!navigator.geolocation) return;

		navigator.geolocation.getCurrentPosition(
			(position) => {
				center = { lat: position.coords.latitude, lng: position.coords.longitude };
			},
			(err) => {
				console.warn('[geolocation] failed, keeping default:', err.message);
			},
			{ enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 }
		);
	});

	const markers = getMarkers();
</script>

<div class="flex h-screen w-full">
	<LeafletMap {center} {markers} onMapClick={addMarker} class="h-full flex-1" />

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

	<MarkerModal />
</div>
