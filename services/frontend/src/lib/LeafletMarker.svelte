<script lang="ts">
	import type { LatLng } from './stores/markers.svelte';

	let { latlng }: {latlng: LatLng} = $props();
</script>

<li>
	{latlng[0].toFixed(4)}, {latlng[1].toFixed(4)}
</li>
