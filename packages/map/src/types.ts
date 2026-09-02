import type { MapMarkerData } from '@goto/domain';
import type L from 'leaflet';

export type MapMarker = MapMarkerData & {
    icon?: L.DivIcon | L.Icon;
};
