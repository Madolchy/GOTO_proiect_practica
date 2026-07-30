<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { onDestroy, onMount, setContext } from 'svelte';
	import { sse } from '$lib/stores/sse.svelte.js';
	import { drivers } from '$lib/stores/drivers.svelte.js';
	import { rideStore } from '$lib/stores/ride.svelte.js';

	const queryClient = new QueryClient();
	let { children, data } = $props();

	onMount(() => {
		sse.start(data.userId);
		drivers.init(sse);
		rideStore.init(sse);
	});

	onDestroy(() => {
		rideStore.destroy();
		drivers.destroy();
		sse.stop();
	});

	setContext('userId', () => data.userId);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<QueryClientProvider client={queryClient}>
	<main>
		{@render children()}
	</main>
</QueryClientProvider>
