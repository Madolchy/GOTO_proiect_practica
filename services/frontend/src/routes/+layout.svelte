<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { onDestroy, onMount, setContext } from 'svelte';
	import { sse } from '$lib/stores/sse.svelte.js';
	import { drivers } from '$lib/stores/drivers.svelte.js';
	import { rideStore } from '$lib/stores/ride.svelte.js';
	import { getUserId, setUserId } from '$lib/stores/session.svelte.js';
	import UserIdField from '$lib/UserIdField.svelte';

	const queryClient = new QueryClient();
	let { children } = $props();

	function handleUserIdChange(id: string) {
		setUserId(id);
		sse.start(id);
	}

	onMount(() => {
		sse.start(getUserId());
		drivers.init(sse);
		rideStore.init(sse);
	});

	onDestroy(() => {
		rideStore.destroy();
		drivers.destroy();
		sse.stop();
	});

	setContext('userId', () => getUserId());
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<QueryClientProvider client={queryClient}>
	<main>
		<UserIdField onChange={handleUserIdChange} />
		{@render children()}
	</main>
</QueryClientProvider>
