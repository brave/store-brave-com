import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { Radom } from './types';
import type { SessionDetails } from '$lib/payment-processing/types';

export * from './types';

export * from './adapter';

export const PROVIDER_NAME = 'radom';

export async function radomApi<T = any>(resourcePath: string, options?: RequestInit): Promise<T> {
  const url = `${env.RADOM_BASE_URL}${resourcePath}`;
  console.log(`Calling... ${url}`);

  let response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: env.RADOM_API_KEY
    }
  });

  const responseBody = await response.json();

  if (response.status !== 200) {
    error(400, responseBody);
  }

  return responseBody;
}

export async function createRadomCheckoutSession(
  params: Radom.Checkout.SessionCreateParams
): Promise<SessionDetails> {
  const { checkoutSessionUrl, checkoutSessionId } = await radomApi('/checkout_session', {
    method: 'POST',
    body: JSON.stringify(params)
  });

  return {
    url: checkoutSessionUrl,
    id: checkoutSessionId
  };
}
