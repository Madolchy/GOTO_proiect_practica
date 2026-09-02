export type LatLng = {
    lat: number;
    lng: number;
};

export type RideLocations = {
    origin: LatLng;
    destination: LatLng;
};

export type MapMarkerData = {
    id: string;
    position: LatLng;
};
