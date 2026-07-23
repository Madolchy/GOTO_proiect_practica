<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { getRidePrice } from '$lib/api/price';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { Card, CardContent } from '../card';
	import { Button } from '../button';
	import { requestRide } from '$lib/api/ride';
	import { getContext } from 'svelte';

	const { markers, onConfirm } = $props();

	const getUserId = getContext<() => string>('userId');
	const userId = getUserId();


	const ridePrice = createQuery(() => ({
		queryKey: ['ridePrice', markers[0], markers[1]],
		enabled: markers.length === 2,
		queryFn: () => getRidePrice(markers[0], markers[1])
	}));

	const requestRideMutation = createMutation(() => ({
		mutationFn: () => requestRide({
		    userId: userId,
		    origin: markers[0],
			destination: markers[1],
		}),
	onSuccess: (data) => onConfirm(data.rideId)
	}));
</script>

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
	disabled={ridePrice.isPending || ridePrice.isError || !ridePrice.data || requestRideMutation.isPending}
	onclick={() => requestRideMutation.mutate()}
>
    {requestRideMutation.isPending ? 'Requesting...' : 'Find a driver'}
</Button>
