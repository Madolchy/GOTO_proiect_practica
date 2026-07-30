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
		activePosition?: LatLng;
		clientPosition: { origin: LatLng; destination: LatLng } | null;
		onMapClick?: (latlng: LatLng) => void;
		class?: string;
	};

	let {
		center = { lat: 51.505, lng: -0.09 },
		zoom = 13,
		markers = [],
		activePosition,
		clientPosition,
		onMapClick,
		class: className,
		...rest
	}: Props = $props();

	let mapEl: HTMLDivElement;
	let map = $state<L.Map | undefined>(undefined);
	let rendered: L.Marker[] = [];
	let activeMarker: L.Marker | undefined;
	let clientOriginMarker: L.Marker | undefined;
	let clientDestionationMarker: L.Marker | undefined;

	function syncMarker(
		pos: LatLng | undefined,
		current: L.Marker | undefined
	): L.Marker | undefined {
		current?.remove();
		return pos ? L.marker(pos).addTo(map!) : undefined;
	}

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
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		map.on('click', (e: L.LeafletMouseEvent) => {
			onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
		});

		return () => {
			if (!map) return;
			map.off('click');
			map.remove();
		};
	});

	$effect(() => {
		if (!map) return;

		for (const m of rendered) m.remove();
		rendered = markers.map((latlng) => L.marker(latlng).addTo(map));
	});

	$effect(() => {
		if (!map) return;
		map.setView(center, zoom);
	});

	$effect(() => {
		if (!map) return;
		activeMarker = syncMarker(activePosition, activeMarker);
	});

	$effect(() => {
		if (!map || !clientPosition) return;
		clientOriginMarker = syncMarker(clientPosition.origin, clientOriginMarker);
	});

	$effect(() => {
		if (!map || !clientPosition) return;
		clientDestionationMarker = syncMarker(clientPosition.destination, clientDestionationMarker);
	});
</script>

<div bind:this={mapEl} class={className} {...rest}></div>
