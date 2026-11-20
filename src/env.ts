import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  PUBLIC_ASSETS_PATH: { public: true, static: true },
  SENTRY_DSN: { schema: (input) => input ?? '' },
  STRIPE_WEBHOOK_SECRET: {
    schema: (input) => {
      if (!input) {
        throw new Error('STRIPE_WEBHOOK_SECRET is required');
      }
      return input;
    }
  },
  BASE_URL: { schema: (input) => input ?? '' },
  PRINTFUL_BASE_URL: { schema: (input) => input ?? '' },
  PRINTFUL_STORE_ID: { schema: (input) => input ?? '' },
  PRINTFUL_API_TOKEN: { schema: (input) => input ?? '' },
  STRIPE_KEY: { schema: (input) => input ?? '' },
  API_URL: { schema: (input) => input ?? '' }
});
