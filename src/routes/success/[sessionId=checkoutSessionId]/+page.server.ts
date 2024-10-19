import { env } from '$env/dynamic/private';
import { sdk } from '$lib/graphql/sdk';
import {
  PROVIDER_NAME as RADOM_PROVIDER_NAME,
  radomApi,
  type Radom
} from '$lib/payment-processing/providers/radom';
import {
  stripe,
  PROVIDER_NAME as STRIPE_PROVIDER_NAME
} from '$lib/payment-processing/providers/stripe';
import * as Sentry from '@sentry/node';
import { redirect } from '@sveltejs/kit';
import type Stripe from 'stripe';
import type { PageServerLoad } from './$types';

// TODO: Implement cancel logic
// Add param to distinguish between Stripe and Radom

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

export const load: PageServerLoad = async function load({ params, url }) {
  const provider = url.searchParams.get('provider');
  try {
    let purchasedVariants: { quantity: number; id: string }[] = [];

    if (!provider) {
      throw new Error('No provider was specified.');
    } else if (provider === STRIPE_PROVIDER_NAME) {
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

      purchasedVariants =
        session.line_items?.data?.map((li) => {
          const product = li.price?.product as Stripe.Product;
          const variantId = product.metadata.printfulVariantId;
          return {
            quantity: li.quantity,
            id: variantId
          };
        }) ?? [];
    } else if (provider === RADOM_PROVIDER_NAME) {
      const session: Radom.Checkout.Session = await radomApi(
        `/checkout_session/${params.sessionId}`
      );

      purchasedVariants = session.metadata
        .filter((s) => s.key === 'item')
        .map((item) => JSON.parse(item.value));
    }

    const items = await Promise.all(
      purchasedVariants.map(async (variant) => {
        const { variants } = await sdk.Variant({ printfulId: variant.id });

        return {
          quantity: variant.quantity,
          product: variants?.at(0)
        };
      })
    );

    return {
      title: 'Success',
      purchaseItems: items
    };
  } catch (e) {
    redirect(307, '/');
  }
};
