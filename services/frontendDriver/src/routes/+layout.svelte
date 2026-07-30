<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { socket } from '$lib/stores/socket.svelte';
	import { offerModal } from '$lib/offerModalState.svelte';
	import { clientPositionStore } from '$lib/stores/ride.svelte';
	import { startRide } from '$lib/stores/driver.svelte';
	import { getDriverId } from '$lib/stores/markers.svelte';

	const queryClient = new QueryClient();
	let { children } = $props();

	$effect(() => {
		const cleanups = [
			socket.on('ride:offer', async (payload) => {
				if (!payload) return;

				clientPositionStore.setClientPosition(payload.clientOrigin, payload.clientDestination);

				const driverResponse = await offerModal.forClient(payload);
				if (driverResponse === true) {
					console.log('Sending that we accepted ride', payload);
					socket.emit('ride:accept', { driverId: getDriverId(), rideId: payload.rideId });

					startRide();
				} else {
					socket.emit('ride:declined', { rideId: payload.rideId });
				}
			})
		];

		return () => cleanups.forEach((fn) => fn());
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<QueryClientProvider client={queryClient}>
	<main>
		{@render children()}
	</main>
</QueryClientProvider>
