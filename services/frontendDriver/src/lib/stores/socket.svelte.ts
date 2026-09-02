import { DISPATCH_BACKEND_URL } from '$app/env/public';
import { WEBSOCKET_EVENTS, type SocketEvents } from '$lib/types/socketevents';
import { io, type Socket } from 'socket.io-client';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

type Status = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
type Listener = (data: unknown) => void;

export class SocketService {
	readonly url = `${DISPATCH_BACKEND_URL}/live-driver`;
	status = $state<Status>('idle');
	messages = $state<string[]>([]);
	connected = $derived(this.status === 'connected');

	listeners = new SvelteMap<keyof SocketEvents, SvelteSet<Listener>>();

	private sock: Socket | null = null;
	private getAuthToken: () => string | null = () => null;

	setAuthTokenGetter = (fn: () => string | null) => {
		this.getAuthToken = fn;
	};

	connect = () => {
		this.disconnect();

		if (this.status === 'connecting' || this.status === 'connected') return;
		this.status = 'connecting';

		this.sock = io(this.url, {
			auth: (cb) => cb({ token: this.getAuthToken() })
		});

		for (const event of WEBSOCKET_EVENTS) {
			this.sock.on(event, (payload) => {
				const handlers = this.listeners.get(event);
				if (!handlers || handlers.size === 0) return;

				handlers.forEach((fn) => fn(payload));
			});
		}

		this.sock.on('connect', () => {
			this.status = 'connected';
		});
		this.sock.on('disconnect', () => {
			this.status = 'disconnected';
		});
		this.sock.on('connect_error', () => {
			this.status = 'error';
		});
	};

	on<K extends keyof SocketEvents>(event: K, handler: (data: SocketEvents[K]) => void) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new SvelteSet());
		}

		const set = this.listeners.get(event)!;
		set.add(handler as Listener);

		return () => {
			set.delete(handler as Listener);
			if (this.listeners.size === 0) this.listeners.delete(event);
		};
	}

	emit<K extends keyof SocketEvents>(event: K, data?: any, ack?: (response: any) => void) {
		this.sock?.emit(event, data);
	}

	async emitWithAck<K extends keyof SocketEvents>(event: K, data?: SocketEvents[K]) {
		return await this.sock?.timeout(10000).emitWithAck(event, data);
	}

	// Usage:
	// const result = await client.emitWithAck('updateUser', { id: 42 });

	disconnect = () => {
		this.sock?.removeAllListeners();
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
