<script lang="ts">
	import { onMount } from 'svelte';
	import LeafletMap from '$lib/LeafletMap.svelte';
	import { getActivePosition, getDriverId, updateActivePosition } from '$lib/stores/markers.svelte';
	import { Button } from '$lib/components/ui/button';
	import { connectDriver, getStatus } from '$lib/stores/driver.svelte';
	import { socket } from '$lib/stores/socket.svelte';
	import { DISPATCH_BACKEND_URL } from '$app/env/public';
	import OfferModal from '$lib/OfferModal.svelte';

	// Shown immediately. Recentered to the visitor's real position once
	// the browser geolocation API resolves (requires user permission).
	let center = $state<{ lat: number; lng: number }>({ lat: 44.4268, lng: 26.1025 });

	socket.url = `${DISPATCH_BACKEND_URL}/live-driver`;
	console.log('Socket url is: ', socket.url);
	socket.setAuthTokenGetter(() => getDriverId().toString());

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

	const activePosition = $derived(getActivePosition());
	const driverStatus = $derived(getStatus());
</script>

<div class="flex h-screen w-full">
	<LeafletMap {center} {activePosition} onMapClick={updateActivePosition} class="h-full flex-1" />
	<Button
		disabled={!activePosition || driverStatus == 'connecting'}
		class="absolute bottom-4 left-1/2 z-9999 w-1/2 -translate-x-1/2 border-2 border-black bg-green-700"
		onclick={connectDriver}
	>
		{#if !activePosition}
			Select your current position first
		{:else if activePosition && driverStatus === 'disconnected'}
			Go Live!
		{:else if activePosition && driverStatus === 'connecting'}
			Connecting...
		{:else if activePosition && driverStatus === 'connected'}
			Disconnect.
		{/if}
	</Button>
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
	<OfferModal />
</div>
