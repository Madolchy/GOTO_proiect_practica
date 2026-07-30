<script lang="ts">
	import type { ButtonProps } from '$lib/components/ui/button';
	import DriverActionButton from './driver-action-button.svelte';

	let props: ButtonProps = $props();
</script>

<DriverActionButton {...props}>Pick up client.</DriverActionButton>
