import type { RequestHandler } from './$types';
import type { Stripe } from 'stripe';
import { env } from '$env/dynamic/private';
import { stripe } from '$lib/payment-processing/providers/stripe';
import * as printfulApi from '$lib/printful-api';
import { decrypt, blockedCountryCodes, ValidationError } from '$lib/utils';
import { sdk } from '$lib/graphql/sdk';

import * as Sentry from '@sentry/node';
import { radomApi, type Radom } from '$lib/payment-processing/providers/radom';
import { RADOM_WEBHOOK_VERIFICATION_KEY } from '$env/static/private';

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

export const POST: RequestHandler = async ({ request }) => {
  const event: Radom.PaymentEvent = await request.json();
  const verificationKey = request.headers.get('radom-verification-key') ?? '';

  if (verificationKey !== RADOM_WEBHOOK_VERIFICATION_KEY) {
    return new Response(`Not authorized.`, { status: 401 });
  }

  if (event.eventType === 'managedPayment') {
    const session = await radomApi<Radom.Checkout.Session>(
      `/checkout_session/${event.radomData.checkoutSession.checkoutSessionId}`
    );

    try {
      await sdk.AddProcessedOrder({ idempotencyKey: session.payment.managed.paymentEventId });
      fulfillOrder(session);
    } catch (e: any) {
      if (e.response?.errors[0]?.extensions?.prisma?.code === 'P2002') {
        console.log(`Order for ${session.payment.managed.paymentEventId} has already been processed.`);
      }
    }
  }

  return new Response('', { status: 200 });
};

async function fulfillOrder(session: Radom.Checkout.Session): Promise<void> {
  return;
  try {
    const sessionDetails = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items.data.price.product', 'shipping_cost.shipping_rate']
    });

    const shippingRate = sessionDetails.shipping_cost?.shipping_rate as Stripe.ShippingRate;
    const line_items = sessionDetails.line_items?.data;
    const { customer_details, metadata } = sessionDetails;

    // TODO: is this actually going to work? I think we need to decode the shipping address first...
    if (blockedCountryCodes.includes(metadata?.country_code as string)) {
      throw new ValidationError('Invalid recipient region.');
    }

    const items = line_items?.map((li): App.OrderItem => {
      const product = li.price?.product as Stripe.Product;
      return {
        quantity: li.quantity ?? 1,
        sync_variant_id: parseInt(product.metadata.printfulVariantId)
      };
    });

    const encryptedShippingData = metadata?.shippingData;
    const { shippingDataKey } = await sdk.ShippingDataKey({ id: metadata?.keyId });
    let shippingData: App.Recipient;
    if (encryptedShippingData && shippingDataKey && shippingDataKey.key) {
      shippingData = decrypt(encryptedShippingData, shippingDataKey.key);
    } else {
      throw new Error('Could not find encrypted shippingData or shippingDataKey.');
    }

    const newOrder = {
      recipient: {
        name: shippingData?.name || customer_details?.name,
        email: customer_details?.email,
        address1: shippingData?.address1,
        address2: shippingData?.address2,
        city: shippingData?.city,
        state_code: shippingData?.state_code,
        zip: shippingData?.zip,
        country_code: shippingData?.country_code,
        phone: shippingData?.phone
      },
      shipping: shippingRate?.metadata?.printful_shipping_rate_id,
      external_id: sessionDetails.payment_intent as string,
      items
    };

    // Normalize by removing potential trailing slash
    const isProduction = env.BASE_URL.replace(/\/$/, '').endsWith('brave.com');
    const shouldBeDraft = !isProduction;
    await printfulApi.createOrder(newOrder, { draft: shouldBeDraft });
    await sdk.DeleteShippingDataKey({ id: metadata?.keyId });
  } catch (e: any) {
    console.log(e);
    Sentry.captureMessage(
      `Customer order not submitted to Printful ${session.payment_intent}`,
      'error'
    );
  }
}
