import { PRINTFUL_BASE_URL, PRINTFUL_STORE_ID, PRINTFUL_API_TOKEN } from '$app/env/private';
import { error } from '@sveltejs/kit';

export async function printfulApi(resourcePath: string, options?: RequestInit) {
  const url = `${PRINTFUL_BASE_URL}${resourcePath}`;
  console.log(`Calling... ${url}`);

  let response = await fetch(url, {
    ...options,
    headers: {
      'X-PF-Store-Id': PRINTFUL_STORE_ID,
      Authorization: `Bearer ${PRINTFUL_API_TOKEN}`
    }
  });

  const responseBody = await response.json();

  if (response.status !== 200) {
    error(400, responseBody.result);
  }

  return responseBody.result;
}

interface CreateOrderOptions {
  draft: boolean;
}

export async function createOrder(
  order: App.Order,
  { draft = true }: CreateOrderOptions
): Promise<void> {
  let url = '/orders';
  if (!draft) {
    url += '?confirm=true';
  }

  await printfulApi(url, {
    method: 'POST',
    body: JSON.stringify(order)
  });
}
