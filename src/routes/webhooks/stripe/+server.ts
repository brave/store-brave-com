import type { RequestHandler } from './$types';
import type { Stripe } from 'stripe';
import { env } from '$env/dynamic/private';
import { stripe } from '$lib/stripe-api';
import * as printfulApi from '$lib/printful-api';
import { CustomError, decrypt, sanctionedCountryCodes, ValidationError } from '$lib/utils';
import { sdk } from '$lib/graphql/sdk';

import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: env.SENTRY_DSN,
  maxBreadcrumbs: 5,
  beforeSend(event) {
    if (event.user) {
      delete event.user;
    }
    return event;
  },
});

export const POST: RequestHandler = async ({ request }) => {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') ?? '';

  let event;
  try {
    event = await stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (e: any) {
    return new Response(`Webhook Error: ${e.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await sdk.AddProcessedOrder({ idempotencyKey: session.payment_intent });
      fulfillOrder(session);
    } catch (e: any) {
      if (e.response?.errors[0]?.extensions?.prisma?.code === "P2002") {
        console.log(`Order for ${session.payment_intent} has already been processed.`);
      }
    }
  }

  return new Response('', { status: 200 });
};

async function fulfillOrder(session: Stripe.Checkout.Session): Promise<void> {
  try {
    const sessionDetails = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items.data.price.product', 'shipping_cost.shipping_rate']
    });

    const shippingRate = sessionDetails.shipping_cost?.shipping_rate as Stripe.ShippingRate;
    const line_items = sessionDetails.line_items?.data;
    const { customer_details, metadata } = sessionDetails;

    if (sanctionedCountryCodes.includes(metadata?.country_code as string)) {
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
      throw new CustomError("Could not find encrypted shippingData or shippingDataKey.");
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

    const shouldBeDraft = !env.BASE_URL.startsWith("https://brave.com");
    await printfulApi.createOrder(newOrder, { draft: shouldBeDraft });
    await sdk.DeleteShippingDataKey({ id: metadata?.keyId });
  } catch (e: any) {
    console.log(e);
    Sentry.captureMessage(`Customer order not submitted to Printful ${session.payment_intent}`, 'error');
  }
}
