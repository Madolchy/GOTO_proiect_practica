<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { setContext } from 'svelte';

	const queryClient = new QueryClient();
	let { children, data } = $props();

	setContext('userId', () => data.userId);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<QueryClientProvider client={queryClient}>
	<main>
		{@render children()}
	</main>
</QueryClientProvider>
