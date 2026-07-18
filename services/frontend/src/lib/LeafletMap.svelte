<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
	import markerIcon from 'leaflet/dist/images/marker-icon.png';
	import markerShadow from 'leaflet/dist/images/marker-shadow.png';
	import type { LatLng } from './stores/markers.svelte';

	type Props = {
		center?: LatLng;
		zoom?: number;
		markers?: LatLng[];
		onMapClick?: (latlng: LatLng) => void;
		class?: string;
	};

	let {
		center = [51.505, -0.09],
		zoom = 13,
		markers = [],
		onMapClick,
		class: className,
		...rest
	}: Props = $props();

	let mapEl: HTMLDivElement;
	let map = $state<L.Map | undefined>(undefined);
	let rendered: L.Marker[] = [];

	onMount(() => {
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: markerIcon2x,
			iconUrl: markerIcon,
			shadowUrl: markerShadow
		});

		// Fix for leaflet bug with vite having an appended wrong path.
		L.Icon.Default.imagePath = '';

		map = L.map(mapEl).setView(center, zoom);
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		map.on('click', (e: L.LeafletMouseEvent) => {
			onMapClick?.([e.latlng.lat, e.latlng.lng]);
		});

		return () => {
			if (!map) return;
			map.off('click');
			map.remove();
		};
	});

	$effect(() => {
		if (!map) return;

		const layer = map; // capture so the closure keeps the narrowed type
		for (const m of rendered) m.remove();

		rendered = markers.map((latlng) => L.marker(latlng).addTo(layer));
	});

	$effect(() => {
		if (!map) return
		map.setView(center, zoom);
	});
</script>

<div bind:this={mapEl} class={className} {...rest}></div>
