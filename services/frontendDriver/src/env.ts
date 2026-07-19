import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PRICE_BACKEND_URL: {
		public: true,
		description: 'Base URL of the backend API the frontend talks to'
	},

	DISPATCH_BACKEND_URL: {
        public: true,
        description: 'Base URL of the backend API for driver dispatches'
	}
});
