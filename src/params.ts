import { defineParams } from '@sveltejs/kit/params';

function matchCuid(param: string) {
  return /^c[0-9a-z]{6,}$/.test(param);
}

function matchInt(param: string) {
  return /^\d+?$/.test(param);
}

function matchPagination(param: string) {
  if (param) {
    // Since this is used for a ...rest param, this must account for presence of trailing slash.
    return /^page\/\d+?\/?$/.test(param);
  } else {
    return true;
  }
}

function matchSlug(param: string) {
  return /^[a-zA-Z0-9_-]+$/.test(param);
}

function matchStripeCheckoutSessionId(param: string) {
  return /^cs_[a-zA-Z0-9_-]+$/.test(param);
}

export const params = defineParams({
  cuid: (param) => (matchCuid(param) ? param : undefined),
  int: (param) => (matchInt(param) ? param : undefined),
  pagination: (param) => (matchPagination(param) ? param : undefined),
  slug: (param) => (matchSlug(param) ? param : undefined),
  stripeCheckoutSessionId: (param) => (matchStripeCheckoutSessionId(param) ? param : undefined)
});
