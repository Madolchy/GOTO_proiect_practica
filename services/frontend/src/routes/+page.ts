// Render entirely on the client. Browser-only libraries (Leaflet) and
// APIs (navigator.geolocation) are imported/called safely without SSR.
import type { PageLoad } from './$types';

const API_URL = 'https://example.com/api/';

export const ssr = false;

export const load: PageLoad = ({ fetch }) => {
	fetch(API_URL)
		.then((response) => response.json())
		.then((data) => console.log('data:', data))
		.catch((error) => console.error('Fetch failed:', error));
};
