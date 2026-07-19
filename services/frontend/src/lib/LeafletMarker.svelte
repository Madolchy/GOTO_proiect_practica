<script lang="ts">
	import type { LatLng } from './stores/markers.svelte.ts';

	let { latlng }: { latlng: LatLng } = $props();
</script>

<li>
	{latlng.lat.toFixed(4)}, {latlng.lng.toFixed(4)}
</li>
