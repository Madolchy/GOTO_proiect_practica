<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Card, CardContent } from '../card';
	import { Button } from '../button';

	let { onDone }: { onDone: () => void } = $props();
</script>

<Dialog.Header>
	<Dialog.Title class="text-center">Ride complete</Dialog.Title>
</Dialog.Header>

<Card class="bg-zinc-100">
	<CardContent class="space-y-2">
		<p class="text-center text-lg font-semibold">Rate your ride</p>
		<p class="text-center text-muted-foreground">
			Leave feedback about your experience to help us improve.
		</p>
	</CardContent>
</Card>

<Button class="bg-emerald-700" onclick={onDone}>Done</Button>
