<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { DriverState } from '$lib/stores/driver.svelte';
	import type { LatLng } from '$lib/stores/markers.svelte';
	import {
		CompletRideButton,
		ConnectingButton,
		DisconnectButton,
		GoLiveButton,
		PickupClientButton,
		SelectPositionButton
	} from '.';
	import DriverActionButton from './driver-action-button.svelte';

	type Props = {
		activePosition: LatLng | undefined;
		driverStatus: DriverState;
		isDriverNearbyClient: boolean;
		isDriverNearbyDestination: boolean;
		onConnect: () => void;
		onDisconnect: () => void;
		onPickup: () => void;
		onCompleteTrip: () => void;
	};

	let {
		activePosition,
		driverStatus,
		isDriverNearbyClient,
		isDriverNearbyDestination,
		onConnect,
		onDisconnect,
		onPickup,
		onCompleteTrip
	}: Props = $props();

	const statusMap = () => ({
		disconnected: disconnectedBtn,
		connecting: connectingBtn,
		connected: connectedBtn,
		en_route: enRouteBtn,
		transit: transitBtn,
		error: errorBtn
	});
</script>

{#snippet disconnectedBtn()}
	<GoLiveButton onclick={onConnect} />
{/snippet}

{#snippet connectingBtn()}
	<ConnectingButton disabled />
{/snippet}

{#snippet connectedBtn()}
	<DisconnectButton onclick={onDisconnect} />
{/snippet}

{#snippet enRouteBtn()}
	<PickupClientButton onclick={onPickup} disabled={!isDriverNearbyClient} />
{/snippet}

{#snippet transitBtn()}
	<CompletRideButton onclick={onCompleteTrip} disabled={!isDriverNearbyDestination} />
{/snippet}

{#snippet errorBtn()}
	<DriverActionButton disabled>Location unavailable</DriverActionButton>
{/snippet}

{#if !activePosition}
	<SelectPositionButton disabled />
{:else}
	{@render statusMap()[driverStatus]()}
{/if}
