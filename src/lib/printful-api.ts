import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://e00d82a426214c97baee6ed6ad8e9eb4@o52257.ingest.sentry.io/4504079803613184",
  maxBreadcrumbs: 5,
  beforeSend(event) {
    if (event.user) {
      delete event.user;
    }
    return event;
  },
});

export async function printfulApi (resourcePath: string, options?: RequestInit) {
  const url = `${env.PRINTFUL_BASE_URL}${resourcePath}`;
  console.log(`Calling... ${url}`);

  let response = await fetch(url, {
    ...options,
    headers: {
      'X-PF-Store-Id': env.PRINTFUL_STORE_ID,
      Authorization: `Bearer ${env.PRINTFUL_API_TOKEN}`
    }
  });

  const responseBody = await response.json();

  if (response.status !== 200) {
    throw error(400, responseBody.result);
  }

  return responseBody.result;
}

export async function createOrder (order: App.Order): Promise<void> {
  try {
    await printfulApi("/orders", {
      method: "POST",
      body: JSON.stringify(order)
    });
  } catch (e: any) {
    console.log(e);
    Sentry.captureMessage(`Customer order not submitted to Printful ${order.external_id}`, 'error')
  }
}