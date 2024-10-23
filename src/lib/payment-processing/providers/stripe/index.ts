import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

export const PROVIDER_NAME = 'stripe';

export type * from "stripe";

export * from './adapter';

// @ts-ignore
export const stripe = new Stripe(!building && env.STRIPE_KEY, {
  apiVersion: '2022-11-15'
});
