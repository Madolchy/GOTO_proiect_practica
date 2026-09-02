<script lang="ts">
    import { onMount } from 'svelte';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
    import markerIcon from 'leaflet/dist/images/marker-icon.png';
    import markerShadow from 'leaflet/dist/images/marker-shadow.png';
    import type { LatLng, RideLocations } from '@goto/domain';
    import type { MapMarker } from './types';

    type Props = {
        center?: LatLng;
        zoom?: number;
        markers?: LatLng[];
        driverMarkers?: MapMarker[];
        activePosition?: LatLng;
        clientPosition?: RideLocations | null;
        onMapClick?: (latlng: LatLng) => void;
        class?: string;
    };

    let {
        center = { lat: 51.505, lng: -0.09 },
        zoom = 13,
        markers = [],
        driverMarkers = [],
        activePosition,
        clientPosition = null,
        onMapClick,
        class: className,
        ...rest
    }: Props = $props();

    let mapEl: HTMLDivElement;
    let map = $state<L.Map | undefined>(undefined);
    let renderedMarkers: L.Marker[] = [];
    let renderedDrivers = new Map<string, L.Marker>();
    let activeMarker: L.Marker | undefined;
    let clientOriginMarker: L.Marker | undefined;
    let clientDestinationMarker: L.Marker | undefined;

    function syncMarkers(layer: L.Map, incoming: MapMarker[], cache: Map<string, L.Marker>) {
        const next = new Map(incoming.map((marker) => [marker.id, marker]));

        for (const [id, marker] of cache) {
            if (!next.has(id)) {
                marker.remove();
                cache.delete(id);
            }
        }

        for (const [id, marker] of next) {
            const existing = cache.get(id);
            if (existing) {
                existing.setLatLng(marker.position);
                if (marker.icon) existing.setIcon(marker.icon);
                continue;
            }

            cache.set(
                id,
                L.marker(marker.position, marker.icon ? { icon: marker.icon } : {}).addTo(layer)
            );
        }
    }

    function syncMarker(
        layer: L.Map,
        position: LatLng | undefined,
        current: L.Marker | undefined
    ): L.Marker | undefined {
        current?.remove();
        return position ? L.marker(position).addTo(layer) : undefined;
    }

    onMount(() => {
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: markerIcon2x,
            iconUrl: markerIcon,
            shadowUrl: markerShadow
        });
        // Fix for Leaflet and Vite appending an incorrect asset path.
        L.Icon.Default.imagePath = '';

        const currentMap = L.map(mapEl).setView(center, zoom);
        map = currentMap;
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(currentMap);

        currentMap.on('click', (event: L.LeafletMouseEvent) => {
            onMapClick?.({ lat: event.latlng.lat, lng: event.latlng.lng });
        });

        return () => {
            currentMap.off('click');
            currentMap.remove();
            map = undefined;
        };
    });

    $effect(() => {
        if (!map) return;
        const layer = map;

        for (const marker of renderedMarkers) marker.remove();
        renderedMarkers = markers.map((latlng) => L.marker(latlng).addTo(layer));
    });

    $effect(() => {
        if (map) syncMarkers(map, driverMarkers, renderedDrivers);
    });

    $effect(() => {
        map?.setView(center, zoom);
    });

    $effect(() => {
        if (!map) return;
        activeMarker = syncMarker(map, activePosition, activeMarker);
    });

    $effect(() => {
        if (!map) return;
        clientOriginMarker = syncMarker(map, clientPosition?.origin, clientOriginMarker);
        clientDestinationMarker = syncMarker(map, clientPosition?.destination, clientDestinationMarker);
    });
</script>

<div bind:this={mapEl} class={className} {...rest}></div>
