import { env } from '$env/dynamic/private';
import type { Stripe } from 'stripe';
import { CANCELED_SESSION_QUERY_PARAM } from '../../constants';
import type { ProviderDataAdapter } from '../../types';

export const stripeAdapter: ProviderDataAdapter<Stripe.Checkout.SessionCreateParams> = (
  items,
  encryptedShippingAddress,
  shippingRates
) => {
  const stripeShippingOptions: Array<Stripe.Checkout.SessionCreateParams.ShippingOption> =
    shippingRates.map((shippingRate): Stripe.Checkout.SessionCreateParams.ShippingOption => {
      const shippingOption = {
        shipping_rate_data: {
          display_name: shippingRate.displayName,
          type: 'fixed_amount',
          metadata: {
            printful_shipping_rate_id: shippingRate.id
          },
          fixed_amount: {
            amount: Math.round(parseFloat(shippingRate.rate) * 100),
            currency: 'USD'
          }
        }
      } as Stripe.Checkout.SessionCreateParams.ShippingOption;

      // Check to see if we can create a delivery_estimate property
      if (
        shippingOption.shipping_rate_data &&
        (shippingRate.minDeliveryDays || shippingRate.maxDeliveryDays)
      ) {
        shippingOption.shipping_rate_data.delivery_estimate = {};

        // Add the minimum estimate if Printful provided one
        if (shippingRate.minDeliveryDays) {
          shippingOption.shipping_rate_data.delivery_estimate.minimum = {
            unit: 'day',
            value: shippingRate.minDeliveryDays
          };
        }

        // Add the maximum estimate if Printful provided one
        if (shippingRate.maxDeliveryDays) {
          shippingOption.shipping_rate_data.delivery_estimate.maximum = {
            unit: 'day',
            value: shippingRate.maxDeliveryDays
          };
        }
      }

      return shippingOption;
    });

  // Format line_item data for Stripe
  const line_items: Array<Stripe.Checkout.SessionCreateParams.LineItem> = items.map(
    ({ id, quantity, ...item }) => {
      return {
        price_data: {
          currency: item.details.currency,
          product_data: {
            name: item.details.name,
            images: [item.details.files.at(-1)?.thumbnail_url as string],
            metadata: {
              printfulVariantId: item.printfulVariantId,
              baseVariantId: item.details.baseVariantId
            }
          },
          unit_amount: Math.round(item.details.price * 100)
        },
        quantity
      };
    }
  );

  return {
    line_items,
    mode: 'payment',
    success_url: `${env.BASE_URL}/success/{CHECKOUT_SESSION_ID}/`,
    cancel_url: `${env.BASE_URL}/cart/?${CANCELED_SESSION_QUERY_PARAM}={CHECKOUT_SESSION_ID}`,
    allow_promotion_codes: true,
    shipping_options: stripeShippingOptions,
    invoice_creation: {
      enabled: true
    },
    metadata: {
      shippingData: encryptedShippingAddress.encryptedData,
      keyId: encryptedShippingAddress.encryptionKeyId
    }
  };
};
