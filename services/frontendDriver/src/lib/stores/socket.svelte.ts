import { offerModal } from '$lib/offerModalState.svelte';
import { io, type Socket } from 'socket.io-client';

type Status = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

export class SocketService {
	url = $state('');
	status = $state<Status>('idle');
	messages = $state<string[]>([]);
	connected = $derived(this.status === 'connected');

	private sock: Socket | null = null;
	private getAuthToken: () => string | null = () => null;

	setAuthTokenGetter = (fn: () => string | null) => {
		this.getAuthToken = fn;
	};

	connect = () => {
		if (this.status === 'connecting' || this.status === 'connected') return;
		this.status = 'connecting';

		this.sock = io(this.url, {
			auth: (cb) => cb({ token: this.getAuthToken() })
		});

		this.sock.on('connect', () => {
			this.status = 'connected';
		});
		this.sock.on('disconnect', () => {
			this.status = 'disconnected';
		});
		this.sock.on('connect_error', () => {
			this.status = 'error';
		});
		this.sock.on('ride:offer', async (payload) => {
			const driverResponse = await offerModal.forClient(payload);
			if (driverResponse === true) {
				console.log('Sending that we accepted ride');
				this.sock?.emit('ride:accept', { rideId: payload.rideId });
			} else {
				this.sock?.emit('ride:declined', { rideId: payload.rideId });
			}
		});
	};

	disconnect = () => {
		this.sock?.disconnect();
		this.sock = null;
		this.status = 'idle';
	};

	toggle = () => {
		if (this.connected) this.disconnect();
		else this.connect();
	};
}

export const socket = new SocketService();
