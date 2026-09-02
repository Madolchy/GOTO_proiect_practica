<script lang="ts">
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils.js';
	import { getUserId, regenerateUserId } from '$lib/stores/session.svelte.js';

	let { onChange }: { onChange: (id: string) => void } = $props();
</script>

<div class="fixed top-4 right-4 z-[1100] flex items-center gap-2">
	<input
		type="text"
		value={getUserId()}
		oninput={(e) => onChange((e.currentTarget as HTMLInputElement).value)}
		spellcheck={false}
		autocomplete="off"
		class="w-80 rounded-lg border bg-background/90 px-3 py-1.5 text-xs shadow-sm backdrop-blur focus:ring-2 focus:ring-ring focus:outline-none"
	/>
	<button
		type="button"
		title="Generate new UUID"
		aria-label="Generate new UUID"
		class={cn(buttonVariants({ variant: 'outline', size: 'icon-sm' }))}
		onclick={() => onChange(regenerateUserId())}
	>
		<RefreshCwIcon />
	</button>
</div>
