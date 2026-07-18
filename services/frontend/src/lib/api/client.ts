export class ApiError extends Error {
	constructor(
		message: string,
		public readonly status: number,
	) {
		super(message);
		this.name = 'ApiError';
	}
}

export async function apiGet<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, init);
	if (!res.ok) {
		throw new ApiError(`GET ${url} failed with ${res.status}`, res.status);
	}
	return res.json() as Promise<T>;
}
