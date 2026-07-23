<script lang="ts">
	import { COORDINATOR_BACKEND_URL } from '$app/env/public';
	import * as Dialog from '$lib/components/ui/dialog';
	import { onDestroy, onMount } from 'svelte';
	import { Card, CardContent } from '../card';

	const { rideId } = $props();

	let es: EventSource | null = null;
	onMount(() => {
		console.log('Trying to do sse connect?');
		es = new EventSource(`${COORDINATOR_BACKEND_URL}/dispatch/sse/${rideId}`);
		es.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log('Received SSE: ', data);
		};
		es.onerror = (error) => {
			console.error('SSE error: ', error);
		};
		es.addEventListener('driver.found', (event) => {
			const data = JSON.parse(event.data);
			console.log('Found a driver with data: ', data);
		});
	});

	onDestroy(() => {
		if (es) es.close();
	});
</script>

<Dialog.Header>
	<Dialog.Title class="text-center">Finding driver</Dialog.Title>
</Dialog.Header>

<Card class="bg-zinc-100">
	<CardContent class="">Finding a suitable driver!</CardContent>
</Card>
