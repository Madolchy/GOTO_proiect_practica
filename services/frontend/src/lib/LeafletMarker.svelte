<script lang="ts">
	import type { LatLng } from '@goto/domain';

	let { latlng }: { latlng: LatLng } = $props();
</script>

<li>
	{latlng.lat.toFixed(4)}, {latlng.lng.toFixed(4)}
</li>
