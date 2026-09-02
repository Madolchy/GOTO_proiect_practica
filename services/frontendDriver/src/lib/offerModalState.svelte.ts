import type { RideOffer } from '@goto/domain';

type ClientRide = Pick<RideOffer, 'clientOrigin' | 'clientDestination'>;

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
