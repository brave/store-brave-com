import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

export * from "./adapter"

// @ts-ignore
export const stripe = new Stripe(!building && env.STRIPE_KEY, {
  apiVersion: '2022-11-15'
});
