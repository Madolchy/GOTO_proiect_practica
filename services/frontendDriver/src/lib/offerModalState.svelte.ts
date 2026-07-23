import type { LatLng } from './stores/markers.svelte';

type ClientRide = {
	clientOrigin: LatLng;
	clientDestination: LatLng;
};

type OfferResolver = (confirmed: boolean) => void;

type OfferModalState = {
	payload: ClientRide | null;
	resolve: OfferResolver | null;
};

export function createOfferModal() {
	const state = $state<OfferModalState>({
		payload: null,
		resolve: null
	});

	function forClient(payload: ClientRide): Promise<boolean> {
		// should be enforced by backend to not happen
		if (state.payload !== null) {
			return Promise.resolve(false);
		}

		state.payload = payload;
		return new Promise((resolve) => {
			state.resolve = resolve;
		});
	}

	function resolve(confirmed: boolean) {
		state.resolve?.(confirmed);
		state.resolve = null;
		state.payload = null;
	}

	return { state, forClient, resolve };
}

export const offerModal = createOfferModal();
