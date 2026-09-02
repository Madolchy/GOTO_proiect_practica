<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { getMarkers, clearMarkers } from '$lib/stores/markers.svelte';
	import {
		PriceStep,
		DriverStep,
		DriverFoundStep,
		DriveComplet,
		RideFailed
	} from './components/ui/modals';
	import { rideStore } from './stores/ride.svelte';
	import type { Ride } from './types/sse';

	const markers = getMarkers();
	const open = $derived(markers.length === 2);

	function handleOpenChange(next: boolean) {
		if (next) return;

		if (rideStore.current.status === 'completed' || rideStore.current.status === 'cancelled') {
			rideStore.setCurrent({ status: 'idle' });
		}

		clearMarkers();
	}

	function finishCompletedRide() {
		rideStore.setCurrent({ status: 'idle' });
		clearMarkers();
	}

	function handleRideFailed() {
		rideStore.setCurrent({ status: 'idle' });
		clearMarkers();
	}

	function handleRideRequest(ride: Ride) {
		console.log('Mutation responded with: ', ride);
		console.log('Received ride from backend: ', ride);
		rideStore.setCurrent(ride);
	}
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
	<Dialog.Content showCloseButton={false}>
		{console.log('Ridestore is: ', rideStore)}
		{console.log('Ridestore current is: ', rideStore.current)}

		{#if rideStore?.current?.status === 'idle'}
			<PriceStep {markers} onConfirm={handleRideRequest} />
		{:else if rideStore?.current?.status === 'searching'}
			<DriverStep />
		{:else if rideStore?.current?.rideId && rideStore?.current?.status === 'en_route'}
			<DriverFoundStep />
		{:else if rideStore?.current?.status === 'completed'}
			<DriveComplet onDone={finishCompletedRide} />
		{:else if rideStore?.current?.status === 'cancelled'}
			<RideFailed onDone={handleRideFailed} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
