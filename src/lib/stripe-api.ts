import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

export const stripe = new Stripe(env.STRIPE_KEY, {
  apiVersion: '2022-11-15'
});
