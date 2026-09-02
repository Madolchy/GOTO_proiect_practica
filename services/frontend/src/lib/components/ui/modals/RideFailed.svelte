<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Card, CardContent } from '../card';
	import { Button } from '../button';

	let { onDone }: { onDone: () => void } = $props();
</script>

<Dialog.Header>
	<Dialog.Title class="text-center">Ride failed</Dialog.Title>
</Dialog.Header>

<Card class="bg-zinc-100">
	<CardContent class="space-y-2">
		<p class="text-center text-lg font-semibold">No drivers available</p>
		<p class="text-center text-muted-foreground">
			There are no available drivers at this time, try again later.
		</p>
	</CardContent>
</Card>

<Button class="bg-emerald-700" onclick={onDone}>Done</Button>
