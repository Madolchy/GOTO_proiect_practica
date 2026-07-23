<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { getMarkers, clearMarkers } from '$lib/stores/markers.svelte';
	import DriverStep from './components/ui/modals/DriverStep.svelte';
	import PriceStep from './components/ui/modals/PriceStep.svelte';

	let clientState = $state<'idle' | 'waiting'>('idle');
	let rideId = $state<string | null>(null);
	const markers = getMarkers();
	const open = $derived(markers.length === 2);

	function handleOpenChange(next: boolean) {
		if (!next) clearMarkers();
	}

	function handleRideRequest(id: string) {
		rideId = id;
		clientState = 'waiting';
	}
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
	<Dialog.Content showCloseButton={false}>
		{#if clientState === 'idle'}
			<PriceStep {markers} onConfirm={handleRideRequest} />
		{:else if clientState === 'waiting' && rideId}
			<DriverStep {rideId} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
