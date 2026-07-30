<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { getMarkers, clearMarkers } from '$lib/stores/markers.svelte';
	import DriverFoundStep from './components/ui/modals/DriverFoundStep.svelte';
	import DriverStep from './components/ui/modals/DriverStep.svelte';
	import PriceStep from './components/ui/modals/PriceStep.svelte';
	import { rideStore } from './stores/ride.svelte';
	import type { Ride } from './types/sse';

	const markers = getMarkers();
	const open = $derived(markers.length === 2);

	function handleOpenChange(next: boolean) {
		if (!next) clearMarkers();
	}

	function handleRideRequest(ride: Ride) {
		console.log('Mutation responded with: ', ride);
		console.log("Received ride from backend: ", ride);
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
		{:else if rideStore?.current?.rideId && rideStore?.current?.status === 'driver_assigned'}
			<DriverFoundStep />
		{/if}
	</Dialog.Content>
</Dialog.Root>
