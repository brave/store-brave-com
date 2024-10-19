import { sdk } from '$lib/graphql/sdk';
import type { ShippingAddress } from '$lib/payment-processing';
import { initCheckoutSession } from '$lib/payment-processing/checkoutSession';
import {
  CANCELED_SESSION_QUERY_PARAM,
  PROVIDER_QUERY_PARAM
} from '$lib/payment-processing/constants';
import {
  createRadomCheckoutSession,
  PROVIDER_NAME as RADOM_PROVIDER_NAME,
  radomAdapter,
  radomApi,
  type Radom
} from '$lib/payment-processing/providers/radom';
import {
  stripe,
  PROVIDER_NAME as STRIPE_PROVIDER_NAME,
  stripeAdapter
} from '$lib/payment-processing/providers/stripe';
import { printfulApi } from '$lib/printful-api';
import { blockedCountryCodes } from '$lib/utils';
import type { CountryCallingCode, CountryCode } from 'libphonenumber-js';
import { getCountryCallingCode, isSupportedCountry } from 'libphonenumber-js/max';
import type { Actions, PageServerLoad } from './$types';

export type CartRequestBody = {
  items: Array<{
    id: string;
    quantity: string;
  }>;
  shippingAddress: ShippingAddress;
};

interface StateCountry {
  code: string;
  name: string;
}

function sortStateCountryAlphabetically(a: StateCountry, b: StateCountry) {
  const aName = a.name.toUpperCase();
  const bName = b.name.toUpperCase();

  if (aName > bName) {
    return 1;
  } else if (aName < bName) {
    return -1;
  } else {
    return 0;
  }
}

/**
 * This is used to both set and retrieve a query param
 * in the event that the user cancels the Stripe checkout
 * session by clicking 'Back' on the checkout page.
 */
export const load: PageServerLoad = async ({ url }) => {
  /**
   * If this page load is from a canceled session then delete
   * the shipping data key from DB.
   */
  const canceledSession = url.searchParams.get(CANCELED_SESSION_QUERY_PARAM);
  const provider = url.searchParams.get(PROVIDER_QUERY_PARAM);

  if (canceledSession) {
    try {
      if (provider === STRIPE_PROVIDER_NAME) {
        const session = await stripe.checkout.sessions.retrieve(canceledSession);
        if (session.status === 'open') {
          await stripe.checkout.sessions.expire(canceledSession);
        }
        if (session.metadata?.keyId) {
          await sdk.DeleteShippingDataKey({ id: session.metadata?.keyId });
        }
      } else if (provider === RADOM_PROVIDER_NAME) {
        const session = await radomApi<{
          metadata: [{ key: string; value: string }];
          sessionStatus: Radom.Checkout.SessionStatus;
        }>(`/checkout_session/${canceledSession}`);
        if (session.sessionStatus === "pending") {
          await radomApi(`/checkout_session/${canceledSession}/cancel`, {
            method: 'POST'
          });
        }
        const keyId = session.metadata.find((v) => v.key === 'shippingDataEncryptionKeyId')?.value;
        if (keyId) {
          await sdk.DeleteShippingDataKey({ id: keyId });
        }
      }
    } catch (e: any) {
      if (e?.message?.includes('ShippingDataKey')) {
        console.error(
          `Could not delete shipping data key due to error: ${e?.response?.errors[0]?.message}`
        );
      } else {
        console.error(e);
      }
    }
  }

  const countryData = await printfulApi('/countries');

  let countries: Array<StateCountry> = [];
  let statesByCountry: Record<string, Array<StateCountry>> = {};
  for (let country of countryData) {
    const { code, name, states } = country;
    if (!blockedCountryCodes.includes(code)) {
      countries = [...countries, { code, name }];
      statesByCountry[code] = states?.sort(sortStateCountryAlphabetically);
    }
  }

  /**
   * NOTE: this is intentionally placed prior to `countries` being sorted
   * since in this case we want the sorting to be based upon country code
   * and not country name
   */
  type CountryCallingCodeItem = { key: string; code: CountryCode; callingCode: CountryCallingCode };
  const countryCallingCodes: Record<string, CountryCallingCodeItem> = {};
  for (const country of countries) {
    const countryCode = country.code as CountryCode;
    if (isSupportedCountry(countryCode)) {
      const callingCode = getCountryCallingCode(countryCode);
      countryCallingCodes[countryCode] = {
        key: `${countryCode}+${callingCode}`,
        code: country.code as CountryCode,
        callingCode: callingCode
      };
    }
  }

  countries = countries.sort(sortStateCountryAlphabetically);

  return {
    title: 'Cart',
    countries,
    statesByCountry,
    countryCallingCodes
  };
};

export const actions: Actions = {
  purchaseCrypto: async ({ request }) => {
    return initCheckoutSession(request, radomAdapter, createRadomCheckoutSession);
  },
  purchaseCreditCard: async ({ request }) => {
    /**
     * Stripe `create` function cannot be passed by reference, otherwise
     * it will break the context for `this` and result in an error. As
     * such, we must pass a function which calls the `create` method and
     * returns the result.
     */
    return initCheckoutSession(request, stripeAdapter, (params) =>
      stripe.checkout.sessions.create(params)
    );
  }
};
