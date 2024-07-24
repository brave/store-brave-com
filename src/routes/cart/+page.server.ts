import { sdk } from '$lib/graphql/sdk';
import type { ShippingAddress } from '$lib/payment-processing';
import {
  CreateCheckoutSessionError,
  formatCheckoutSessionData
} from '$lib/payment-processing/checkoutSession';
import { createRadomCheckoutSession, radomAdapter } from '$lib/payment-processing/providers/radom';
import { stripe, stripeAdapter } from '$lib/payment-processing/providers/stripe';
import { printfulApi } from '$lib/printful-api';
import { blockedCountryCodes, sleep } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import type { CountryCallingCode, CountryCode } from 'libphonenumber-js';
import { getCountryCallingCode, isSupportedCountry } from 'libphonenumber-js/max';
import { parse, stringify } from 'qs';
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
const canceledSessionQueryParam = 'session_id';

export const load: PageServerLoad = async ({ url }) => {
  /**
   * If this page load is from a canceled session then delete
   * the shipping data key from DB.
   */
  const canceledSession = url.searchParams.get(canceledSessionQueryParam);
  if (canceledSession) {
    try {
      const session = await stripe.checkout.sessions.retrieve(canceledSession);
      await sdk.DeleteShippingDataKey({ id: session.metadata?.keyId });
    } catch (e: any) {
      console.log(`Could not delete shipping data key due to error: ${e.message}`);
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
    /**
     * NOTE: this bit of craziness is because SvelteKit enhanced forms sends as FormData,
     * which doesn't play nice with complex form data (e.g. items[0][quantity], etc.)
     */
    const data = await request.text();
    return console.log(data)
    const requestBody = parse(stringify(Object.fromEntries(data))) as unknown as CartRequestBody;

    let session;
    try {
      const checkoutSessionData = await formatCheckoutSessionData(requestBody, radomAdapter);
      session = await createRadomCheckoutSession(checkoutSessionData);
    } catch (e: any) {
      console.log(`Error creating checkout session: ${e.message}`);
      return handlePurchaseErrors(e);
    }

    if (session.url) {
      redirect(303, session.url);
    }
  },
  purchaseCreditCard: async ({ request }) => {
    /**
     * NOTE: this bit of craziness is because SvelteKit enhanced forms sends as FormData,
     * which doesn't play nice with complex form data (e.g. items[0][quantity], etc.)
     */
    const data = await request.formData();
    const requestBody = parse(stringify(Object.fromEntries(data))) as unknown as CartRequestBody;

    let session;
    try {
      const checkoutSessionData = await formatCheckoutSessionData(requestBody, stripeAdapter);
      session = await stripe.checkout.sessions.create(checkoutSessionData);
    } catch (e) {
      console.log(`Error creating checkout session: ${e.message}`);
      return handlePurchaseErrors(e);
    }

    if (session.url) {
      redirect(303, session.url);
    }
  }
};

function handlePurchaseErrors(e: any) {
  switch (e.message) {
    case CreateCheckoutSessionError.EMPTY_CART:
      return fail(400, { cartEmpty: true });
    case CreateCheckoutSessionError.INVALID_SHIPPING_ADDRESS:
      return fail(400, e.data);
    default:
      return fail(500, { somethingWentWrong: true });
  }
}
