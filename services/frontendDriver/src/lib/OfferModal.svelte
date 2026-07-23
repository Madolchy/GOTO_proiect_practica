<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from './components/ui/button';
	import { offerModal } from './offerModalState.svelte';

	const open = $derived(offerModal.state.payload !== null);
</script>

<Dialog.Root {open} onOpenChange={() => {}}>
	<Dialog.Content showCloseButton={false}>
		{offerModal.state.payload?.clientOrigin.lat} => {offerModal.state.payload?.clientDestination.lat}
		<Button class="bg-emerald-700" onclick={() => offerModal.resolve(true)}>Accept ride!</Button>
		<Button class="bg-red-600" onclick={() => offerModal.resolve(false)}>Decline ride!</Button>
	</Dialog.Content>
</Dialog.Root>
