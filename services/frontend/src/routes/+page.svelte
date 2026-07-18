<script lang="ts">
	import { onMount } from 'svelte';
	import LeafletMap from '$lib/LeafletMap.svelte';
	import { getMarkers, addMarker, clearMarkers } from '$lib/stores/markers.svelte';
	import MarkerModal from '$lib/MarkerModal.svelte';

	// Shown immediately. Recentered to the visitor's real position once
	// the browser geolocation API resolves (requires user permission).
	let center = $state<[number, number]>([44.4268, 26.1025]);

	onMount(() => {
		if (!navigator.geolocation) return;

		navigator.geolocation.getCurrentPosition(
			(position) => {
				center = [position.coords.latitude, position.coords.longitude];
			},
			(err) => {
				console.warn('[geolocation] failed, keeping default:', err.message);
			},
			{ enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 }
		);
	});

	// Reactive reference to the shared marker store. Mutations elsewhere
	// (clicks on the map, the Clear button, etc.) update this list too.
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
			{#each markers as latlng (latlng.join(','))}
				<LeafletMarker {latlng} />
			{/each}
		</LeafletMarkerContainer>
	</aside> -->

	<MarkerModal />
</div>
