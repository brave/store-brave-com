import { env } from '$env/dynamic/private';
import { ENVIRONMENT } from '$env/static/private';
import {
  CANCELED_SESSION_QUERY_PARAM,
  PROVIDER_QUERY_PARAM
} from '$lib/payment-processing/constants';
import type { ProviderParamsAdapter, ShippingRate } from '$lib/payment-processing/types';
import { PROVIDER_NAME } from '.';
import { mainnetTokens, testnetTokens } from './tokens';
import type { Currency, Radom } from './types';

export const metadataKeys = {
  ENCRYPTED_SHIPPING_DATA: 'encryptedShippingData',
  SHIPPING_DATA_ENCRYPTION_KEY_ID: 'shippingDataEncryptionKeyId',
  SHIPPING_RATE_ID: 'shippingRateId',
  ITEM: 'item'
};

export const radomAdapter: ProviderParamsAdapter<Radom.Checkout.SessionCreateParams> = (
  items,
  recipient,
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
  });

  return {
    lineItems,
    currency: 'USD',
    gateway: {
      managed: {
        methods: ENVIRONMENT === 'production' ? mainnetTokens(0.2) : testnetTokens(0.2)
      }
    },
    successUrl: `${env.BASE_URL}/success/{CHECKOUT_SESSION_ID}/?${PROVIDER_QUERY_PARAM}=${PROVIDER_NAME}`,
    cancelUrl: `${env.BASE_URL}/cart/?${CANCELED_SESSION_QUERY_PARAM}={CHECKOUT_SESSION_ID}&${PROVIDER_QUERY_PARAM}=radom`,
    metadata: [
      {
        key: metadataKeys.ENCRYPTED_SHIPPING_DATA,
        value: encryptedShippingAddress.encryptedData
      },
      {
        key: metadataKeys.SHIPPING_DATA_ENCRYPTION_KEY_ID,
        value: encryptedShippingAddress.encryptionKeyId
      },
      {
        key: metadataKeys.SHIPPING_RATE_ID,
        value: shipping.id
      },
      ...items.map((i) => ({
        key: metadataKeys.ITEM,
        value: JSON.stringify({
          id: i.printfulVariantId,
          quantity: i.quantity
        })
      }))
    ],
    chargeCustomerNetworkFee: true,
    customizations: {
      allowDiscountCodes: true
    }
  };
};
