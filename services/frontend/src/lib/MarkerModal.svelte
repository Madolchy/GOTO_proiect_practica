<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { getMarkers, clearMarkers } from '$lib/stores/markers.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { getRidePrice } from './api/price';
	import Button from './components/ui/button/button.svelte';
	import { Card, CardContent } from './components/ui/card';

	const markers = getMarkers();
	const open = $derived(markers.length === 2);

	function handleOpenChange(next: boolean) {
		if (!next) clearMarkers();
	}

	const ridePrice = createQuery(() => ({
		queryKey: ['ridePrice', markers[0], markers[1]],
		enabled: markers.length === 2,
		queryFn: () => getRidePrice(markers[0], markers[1])
	}));
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
	<Dialog.Content showCloseButton={false}>
		<Dialog.Header>
			<Dialog.Title class="text-center">Route price</Dialog.Title>
		</Dialog.Header>

		<Card class="bg-zinc-100">
			<CardContent class="">
				{#if ridePrice.isPending}
					<div class="space-y-2">
						<div class="h-4 w-24 animate-pulse rounded bg-muted"></div>
					</div>
				{:else if ridePrice.isError}
					<p class="text-destructive">Couldn't load price</p>
				{:else if ridePrice.isSuccess && ridePrice.data}
					<p class="text-center text-2xl font-semibold">
						{ridePrice.data.price}
						{ridePrice.data.currency}
					</p>
				{/if}
			</CardContent>
		</Card>
		<Button
			class="bg-emerald-700"
			disabled={ridePrice.isPending || ridePrice.isError || !ridePrice.data}
		>
			Complet your order!
		</Button>
	</Dialog.Content>
</Dialog.Root>
