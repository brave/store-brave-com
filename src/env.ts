import { defineEnvVars } from '@sveltejs/kit/env';

// @migration-task Review usage of dynamic environment variables. They fall back to the empty string if not present, which may not be what you want.
export const variables = defineEnvVars({
  PUBLIC_ASSETS_PATH: { public: true, static: true },
  SENTRY_DSN: { schema: (input) => input ?? '' },
  STRIPE_WEBHOOK_SECRET: { schema: (input) => input ?? '' },
  BASE_URL: { schema: (input) => input ?? '' },
  PRINTFUL_BASE_URL: { schema: (input) => input ?? '' },
  PRINTFUL_STORE_ID: { schema: (input) => input ?? '' },
  PRINTFUL_API_TOKEN: { schema: (input) => input ?? '' },
  STRIPE_KEY: { schema: (input) => input ?? '' },
  API_URL: { schema: (input) => input ?? '' }
});
