import { env } from '$env/dynamic/private';
import { CANCELED_SESSION_QUERY_PARAM } from '$lib/payment-processing/constants';
import type { ProviderDataAdapter, ShippingRate } from '$lib/payment-processing/types';
import type { Currency, Radom } from './types';
import { ENVIRONMENT } from '$env/static/private';
import { mainnetTokens, testnetTokens } from './tokens';

export const radomAdapter: ProviderDataAdapter<Radom.CreateCheckoutSession> = (
  items,
  encryptedShippingAddress,
  shippingRates
) => {
  const lineItems: Array<Radom.LineItem> = items.map((item) => {
    return {
      itemData: {
        name: item.details.name,
        description: `Quantity: ${item.quantity}`,
        price: item.details.price * item.quantity,
        imageUrl: item.details.files.at(-1)?.thumbnail_url as string,
        currency: item.details.currency as Currency
      }
    };
  });

  // TODO: need to figure out how to let users select shipping option?
  const shipping = shippingRates.at(0) as ShippingRate;

  lineItems.push({
    itemData: {
      name: shipping.displayName,
      price: parseFloat(shipping.rate),
      currency: shipping?.currency as Currency
    }
  })

  return {
    lineItems,
    currency: 'USD',
    gateway: {
      managed: {
        methods: ENVIRONMENT === "production" ? mainnetTokens(0.2) : testnetTokens(0.2)
      }
    },
    successUrl: `${env.BASE_URL}/success/{CHECKOUT_SESSION_ID}/`,
    cancelUrl: `${env.BASE_URL}/cart/?${CANCELED_SESSION_QUERY_PARAM}={CHECKOUT_SESSION_ID}`,
    metadata: [
      {
        key: 'encryptedShippingData',
        value: encryptedShippingAddress.encryptedData
      },
      {
        key: 'shippingDataEncryptionKeyId',
        value: encryptedShippingAddress.encryptionKeyId
      }
    ],
    chargeCustomerNetworkFee: true,
    customizations: {
      allowDiscountCodes: true
    }
  };
};
