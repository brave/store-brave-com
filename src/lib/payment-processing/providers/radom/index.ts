import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { Radom } from './types';

export * from './types';

export * from './adapter';

export async function radomApi(resourcePath: string, options?: RequestInit) {
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
  sessionData: Radom.CreateCheckoutSession
): Promise<Radom.CheckoutSession> {
  const { checkoutSessionUrl, checkoutSessionId } = await radomApi('/checkout_session', {
    method: 'POST',
    body: JSON.stringify(sessionData)
  });

  return {
    url: checkoutSessionUrl,
    id: checkoutSessionId
  };
}
