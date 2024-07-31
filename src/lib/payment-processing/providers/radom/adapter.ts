import { env } from '$env/dynamic/private';
import { ENVIRONMENT } from '$env/static/private';
import { CANCELED_SESSION_QUERY_PARAM, PROVIDER_QUERY_PARAM } from '$lib/payment-processing/constants';
import type { ProviderParamsAdapter, ShippingRate } from '$lib/payment-processing/types';
import { PROVIDER_NAME } from '.';
import { mainnetTokens, testnetTokens } from './tokens';
import type { Currency, Radom } from './types';

export const radomAdapter: ProviderParamsAdapter<Radom.Checkout.SessionCreateParams> = (
  items,
  encryptedShippingAddress,
  shippingRates
) => {
  const lineItems: Array<Radom.Checkout.LineItem> = items.map((item) => {
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
    successUrl: `${env.BASE_URL}/success/{CHECKOUT_SESSION_ID}/?${PROVIDER_QUERY_PARAM}=${PROVIDER_NAME}`,
    cancelUrl: `${env.BASE_URL}/cart/?${CANCELED_SESSION_QUERY_PARAM}={CHECKOUT_SESSION_ID}&${PROVIDER_QUERY_PARAM}=radom`,
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
