import { browser } from '$app/environment';

const matomoOrigin = 'https://analytics.brave.com';

// @ts-ignore
let matomoPolicy: TrustedTypePolicy = null;
if (browser) {
  if (typeof window.trustedTypes == 'undefined') {
    // @ts-ignore
    window.trustedTypes = { createPolicy: (n, rules) => rules };
  }

  // @ts-ignore
  matomoPolicy = trustedTypes.createPolicy('matomo-policy', {
    createScriptURL: (url: string) => {
      const trustedURL = new URL(url, matomoOrigin);
      if (trustedURL.origin === matomoOrigin) {
        return trustedURL;
      }
      // e.g. if url = "//mali.cio.us" or "https://ev.il" or "javascript://blah"
      throw new TypeError();
    }
  })
}

export default matomoPolicy;
