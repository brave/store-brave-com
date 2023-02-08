import type { RequestHandler } from './$types';
import type { Stripe } from 'stripe';
import { env } from '$env/dynamic/private';
import { stripe } from '$lib/stripe-api';
import * as printfulApi from '$lib/printful-api';
import { sanctionedCountryCodes, ValidationError } from '$lib/utils';
import { sdk } from '$lib/graphql/sdk';

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
      expand: ['line_items.data.price.product']
    });

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

    const newOrder = {
      recipient: {
        name: customer_details?.name,
        email: customer_details?.email,
        address1: metadata?.address1,
        address2: metadata?.address2,
        city: metadata?.city,
        state_code: metadata?.state_code,
        zip: metadata?.zip,
        country_code: metadata?.country_code
      },
      external_id: sessionDetails.payment_intent as string,
      items
    };

    await printfulApi.createOrder(newOrder);
  } catch (e: any) {
    console.log(session.payment_intent);
    console.log(e.message);
  }
}
