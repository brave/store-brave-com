import { env } from '$env/dynamic/private';
import { sdk } from '$lib/graphql/sdk';
import * as printfulApi from '$lib/printful-api';
import { blockedCountryCodes, decrypt, ValidationError } from '$lib/utils';
import type { RequestHandler } from './$types';

import { RADOM_WEBHOOK_VERIFICATION_KEY } from '$env/static/private';
import { metadataKeys, radomApi, type Radom } from '$lib/payment-processing/providers/radom';
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
        console.log(
          `Order for ${session.payment.managed.paymentEventId} has already been processed.`
        );
      }
    }
  }

  return new Response('', { status: 200 });
};

async function fulfillOrder(session: Radom.Checkout.Session): Promise<void> {
  try {
    const shippingRate = session.metadata.find((d) => d.key === metadataKeys.SHIPPING_RATE_ID);

    const encryptedShippingData = session.metadata.find(
      (d) => d.key === metadataKeys.ENCRYPTED_SHIPPING_DATA
    ).value;
    const shippingDataEncryptionKeyId = session.metadata.find(
      (d) => d.key === metadataKeys.SHIPPING_DATA_ENCRYPTION_KEY_ID
    ).value;
    const { shippingDataKey } = await sdk.ShippingDataKey({ id: shippingDataEncryptionKeyId });
    let shippingData: App.Recipient;
    if (encryptedShippingData && shippingDataKey && shippingDataKey.key) {
      shippingData = decrypt(encryptedShippingData, shippingDataKey.key);
    } else {
      throw new Error('Could not find encrypted shippingData or shippingDataKey.');
    }

    if (blockedCountryCodes.includes(shippingData.country_code)) {
      throw new ValidationError('Invalid recipient region.');
    }

    const items = session.metadata
      .filter((d) => d.key === metadataKeys.ITEM)
      .map((li): App.OrderItem => {
        const { id, quantity } = JSON.parse(li.value);
        return {
          quantity: quantity ?? 1,
          sync_variant_id: parseInt(id)
        };
      });

    const newOrder = {
      recipient: {
        name: shippingData?.name,
        email: shippingData?.email,
        address1: shippingData?.address1,
        address2: shippingData?.address2,
        city: shippingData?.city,
        state_code: shippingData?.state_code,
        zip: shippingData?.zip,
        country_code: shippingData?.country_code,
        phone: shippingData?.phone
      },
      shipping: shippingRate.value,
      external_id: session.payment.managed.paymentEventId.replaceAll('-', ''), // External ID can only be 32 characters
      items
    };

    // Normalize by removing potential trailing slash
    const isProduction = env.BASE_URL.replace(/\/$/, '').endsWith('brave.com');
    const shouldBeDraft = !isProduction;
    await printfulApi.createOrder(newOrder, { draft: shouldBeDraft });
    await sdk.DeleteShippingDataKey({ id: shippingDataEncryptionKeyId });
  } catch (e: any) {
    console.log(e);
    Sentry.captureMessage(
      `Customer order not submitted to Printful ${session.payment.managed.paymentEventId}`,
      'error'
    );
  }
}
