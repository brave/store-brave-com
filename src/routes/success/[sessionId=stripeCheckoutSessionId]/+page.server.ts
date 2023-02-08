import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { stripe } from '$lib/stripe-api';
import type Stripe from 'stripe';
import type { PageServerLoad } from './$types';
import { sdk } from '$lib/graphql/sdk';
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: env.SENTRY_DSN,
  maxBreadcrumbs: 5,
  beforeSend(event) {
    if (event.user) {
      delete event.user;
    }
    return event;
  }
});

export const load: PageServerLoad = async function load({ params }) {
  try {
    const session = await stripe.checkout.sessions.retrieve(params.sessionId, {
      expand: ['line_items.data.price.product']
    });

    /**
     * Determine if webhook associated with checkout session was successful
     */
    const events = await stripe.events.list({
      type: 'checkout.session.completed',
      created: {
        gte: session.created
      }
    });

    const sessionEvents = events.data.filter((e) => {
      const resource = e.data.object as Stripe.Checkout.Session;
      return resource?.id === session.id;
    });

    // If most recent event (index 0) has pending_webhooks, trigger alert.
    if (sessionEvents[0]?.pending_webhooks > 0) {
      console.log('Pending webhooks: ', sessionEvents[0].pending_webhooks);
      Sentry.captureMessage(
        `Customer order not submitted to Printful ${session.payment_intent}`,
        'error'
      );
    }

    const items = await Promise.all(
      session.line_items?.data?.map(async (li) => {
        const product = li.price?.product as Stripe.Product;
        const variantId = product.metadata.printfulVariantId;
        const { variants } = await sdk.Variant({ printfulId: variantId });

        return {
          quantity: li.quantity,
          product: variants?.at(0)
        };
      }) ?? []
    );

    return {
      title: 'Success',
      purchaseItems: items
    };
  } catch (e) {
    throw redirect(307, '/');
  }
};
