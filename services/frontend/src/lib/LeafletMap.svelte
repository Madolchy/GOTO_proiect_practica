<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
	import markerIcon from 'leaflet/dist/images/marker-icon.png';
	import markerShadow from 'leaflet/dist/images/marker-shadow.png';
	import type { LatLng } from './stores/markers.svelte.ts';
	import type { MapMarker } from './utils/markers';
	import { syncMarkers } from './utils/leaflet';

	type Props = {
		center?: LatLng;
		zoom?: number;
		markers?: LatLng[];
		driverMarkers?: MapMarker[];
		onMapClick?: (latlng: LatLng) => void;
		class?: string;
	};

	let {
		center = { lat: 51.505, lng: -0.09 },
		zoom = 13,
		markers = [],
		driverMarkers = [],
		onMapClick,
		class: className,
		...rest
	}: Props = $props();

	let mapEl: HTMLDivElement;
	let map = $state<L.Map | undefined>(undefined);
	let renderedPins: L.Marker[] = [];
	let renderedDrivers = new Map<string, L.Marker>();

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
			onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
		});

		return () => {
			map?.off('click');
			map?.remove();
		};
	});

	$effect(() => {
		if (!map) return;
		const layer = map;

		for (const m of renderedPins) m.remove();

		renderedPins = markers.map((latlng) => L.marker(latlng).addTo(layer));
	});

	$effect(() => {
		if (map) syncMarkers(map, driverMarkers, renderedDrivers);
	});

	$effect(() => {
		map?.setView(center, zoom);
	});
</script>

<div bind:this={mapEl} class={className} {...rest}></div>
