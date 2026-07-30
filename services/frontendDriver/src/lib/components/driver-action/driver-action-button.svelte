<script lang="ts">
	import { Button, type ButtonProps } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';

	let { class: className, children, ...restProps }: ButtonProps = $props();
</script>

<Button
	class={cn(
		'absolute bottom-4 left-1/2 z-9999 w-1/2 -translate-x-1/2 border-2 border-black bg-green-700',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</Button>
