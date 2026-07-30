<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Card, CardContent } from '../card';
</script>

<Dialog.Header>
	<Dialog.Title class="text-center">Driver Found</Dialog.Title>
</Dialog.Header>

<Card class="bg-zinc-100">
	<CardContent class="">
		[name] will be your driver for this ride! In the meantime, you can view where they are on the
		map!
	</CardContent>
</Card>
