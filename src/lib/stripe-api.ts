import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

// @ts-ignore
export const stripe = new Stripe(!building ? env.STRIPE_KEY : 'no_key_during_build_stage', {
  // @ts-ignore stripe-version-2022-11-15
  apiVersion: '2022-11-15'
});
