import Stripe from 'stripe';
import { STRIPE_KEY } from '$app/env/private';
import { building } from '$app/env';

// @ts-ignore
export const stripe = new Stripe(!building ? STRIPE_KEY : 'no_key_during_build_stage', {
  // @ts-ignore stripe-version-2022-11-15
  apiVersion: '2022-11-15'
});
