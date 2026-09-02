import type { LatLng } from './location.js';

export type RideOffer = {
    rideId: string;
    clientOrigin: LatLng;
    clientDestination: LatLng;
};
