import { COORDINATOR_BACKEND_URL } from '$app/env/public';
import { SSE_EVENTS_NAMES, type SseEvents } from '$lib/types/sse';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

type Listener = (data) => void;

export class SseClient {
	private es: EventSource | null = null;
	private listeners = new SvelteMap<keyof SseEvents, SvelteSet<Listener>>();
	public sseStatus = $state<'idle' | 'connecting' | 'open' | 'error'>('idle');

	constructor(private baseUrl: string) {}

	start(userId: string) {
		this.stop();
		this.sseStatus = 'connecting';
		this.es = new EventSource(`${this.baseUrl}/dispatch/sse/${userId}`);

		this.es.onopen = () => {
			this.sseStatus = 'open';
		};
		this.es.onerror = () => {
			this.sseStatus = 'error';
		};

		for (const name of SSE_EVENTS_NAMES) {
			this.es.addEventListener(name, (e: MessageEvent) => {
				const handlers = this.listeners.get(name);
				if (!handlers || handlers.size === 0) return;

				const data = JSON.parse(e.data);
				handlers.forEach((fn) => fn(data));
			});
		}
	}

	stop() {
		this.es?.close();
		this.es = null;
		this.sseStatus = 'idle';
	}

	on<K extends keyof SseEvents>(event: K, handler: (data: SseEvents[K]) => void) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new SvelteSet());
		}

		const set = this.listeners.get(event)!;
		set.add(handler);

		return () => {
			set.delete(handler);
			if (set.size === 0) this.listeners.delete(event);
		};
	}
}

export const sse = new SseClient(COORDINATOR_BACKEND_URL);
