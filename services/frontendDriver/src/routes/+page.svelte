<script lang="ts">
	import { onMount } from 'svelte';
	import { getDistance } from 'geolib';
	import LeafletMap from '$lib/LeafletMap.svelte';
	import { getActivePosition, getDriverId, updateActivePosition } from '$lib/stores/markers.svelte';
	import { completRide, connectDriver, disconnectDriver, getLastReadOrigin, getStatus, pickupClient } from '$lib/stores/driver.svelte';
	import { socket } from '$lib/stores/socket.svelte';
	import { DISPATCH_BACKEND_URL } from '$app/env/public';
	import OfferModal from '$lib/OfferModal.svelte';
	import { clientPositionStore } from '$lib/stores/ride.svelte';
	import DriverActionMap from '$lib/components/driver-action/driver-action-map.svelte';
	// Shown immediately. Recentered to the visitor's real position once
	// the browser geolocation API resolves (requires user permission).
	let center = $state<{ lat: number; lng: number }>({ lat: 44.4268, lng: 26.1025 });

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
	const isDriverNearbyClient = $derived.by(() => {
		const driverOrigin = getLastReadOrigin();
		const clientOrigin = clientPositionStore.position?.origin;
		if (!driverOrigin || !clientOrigin) return false;

		return getDistance(driverOrigin, clientOrigin) < 50;
	});

	const isDriverNearbyDestination = $derived.by(() => {
		const driverOrigin = getLastReadOrigin();
		const clientDestination = clientPositionStore.position?.destination;
		if (!driverOrigin || !clientDestination) return false;

		return getDistance(driverOrigin, clientDestination) < 50;
	});
</script>

<div class="flex h-screen w-full">
	<LeafletMap {center} {activePosition} clientPosition={clientPositionStore.position} onMapClick={updateActivePosition} class="h-full flex-1" />

	<DriverActionMap
		{activePosition}
		{isDriverNearbyClient}
		{isDriverNearbyDestination}
		driverStatus={getStatus()}
		onConnect={connectDriver}
		onDisconnect={disconnectDriver}
		onPickup={pickupClient}
		onCompleteTrip={completRide}
	/>

	<OfferModal />
</div>
