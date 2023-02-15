<script lang="ts">
  // TODO: add more info for tracking without javascript in app.html:
  // https://developer.matomo.org/api-reference/tracking-api

  import { onMount, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { env } from '$env/dynamic/public';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  import type { Variant } from '$lib/graphql/types';
  import { cartStorageKey, contextKey } from '$lib/cartStore';
  import Toast, { Kind as ToastKind } from '$lib/Toast.svelte';
  import Navigation from '$lib/Navigation.svelte';

  import '../app.scss';

  let matomoPolicy;
  if (browser) {
    // @ts-ignore
    if(typeof window.trustedTypes == 'undefined')window.trustedTypes={createPolicy:(n, rules) => rules};

    const matomoOrigin = "https://analytics.brave.com";
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
    });
  }

  let cartItems: Array<App.CartItem> = [];
  if (browser) {
    cartItems = JSON.parse(sessionStorage.getItem('cart') ?? '[]');
  }

  const cartStore = writable(cartItems);

  let showNewItemToast = false;
  let newItemToastTimer: NodeJS.Timeout;

  function triggerNewItemToast() {
    clearTimeout(newItemToastTimer);
    showNewItemToast = true;
    newItemToastTimer = setTimeout(() => {
      showNewItemToast = false;
    }, 4000);
  }

  setContext(contextKey, {
    cartStore,
    addToCart: (item: App.CartItem) => {
      triggerNewItemToast();

      const itemIdx = $cartStore.findIndex((v) => v.variant.id === item.variant.id);
      if (itemIdx >= 0) {
        $cartStore[itemIdx].quantity += item.quantity;
      } else {
        $cartStore = [...$cartStore, item];
      }
      sessionStorage.setItem(cartStorageKey, JSON.stringify($cartStore));
    },
    removeFromCart: (id: Variant['id']) => {
      const itemIdx = $cartStore.findIndex((v) => v.variant.id === id);
      const oldItems = $cartStore;
      $cartStore = [...oldItems.slice(0, itemIdx), ...oldItems.slice(itemIdx + 1)];
      sessionStorage.setItem(cartStorageKey, JSON.stringify($cartStore));
    },
    updateQuantity: (id: Variant['id'], quantity: number) => {
      if (quantity > 0) {
        const itemIdx = $cartStore.findIndex((v) => v.variant.id === id);
        $cartStore[itemIdx].quantity = quantity;
        sessionStorage.setItem(cartStorageKey, JSON.stringify($cartStore));
      }
    },
    emptyCart: () => {
      $cartStore = [];
      sessionStorage.setItem(cartStorageKey, JSON.stringify($cartStore));
    }
  });

  /**
   * Matomo analytics
   */
  let _paq = [];
  if (browser) {
    // @ts-ignore
    _paq = window._paq = window._paq || [];
    const u = 'https://analytics.brave.com/';
    _paq.push(['setTrackerUrl', u + 'matomo.php']);
    _paq.push(['setSiteId', '10']);
    _paq.push(['disableCookies']);
    _paq.push(['enableLinkTracking']);
    const d = document,
      g = d.createElement('script'),
      s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.src = matomoPolicy.createScriptURL('matomo.js');
    s?.parentNode?.insertBefore(g, s);
  }

  afterNavigate((navigation) => {
    // @ts-ignore
    _paq = window._paq = window._paq || [];
    _paq.push(['setReferrerUrl', navigation.from?.url.href ?? '']);
    _paq.push(['setCustomUrl', navigation.to?.url.href]);
    _paq.push(['setDocumentTitle', $page.data.title]);
    _paq.push(['trackPageView']);
  });

  // Remove preload script to allow transitions
  onMount(() => {
    document.documentElement.classList.remove('preload');
  });
</script>

<svelte:head>
  <title>{$page.error ? $page.status : $page.data.title} | Brave Merch Store</title>
  <link rel="preconnect" crossorigin="anonymous" href={env.PUBLIC_ASSETS_PATH} />
</svelte:head>

{#if showNewItemToast}
  <Toast kind={ToastKind.success} message="Item(s) added to shopping cart." />
{/if}

<header class="py-5 border-b border-divider-subtle">
  <Navigation />
</header>

<main class="container mx-auto px-6 pt-10 pb-20 grid auto-rows-max">
  <slot />
</main>

<footer
  data-theme="dark"
  class="text-text-primary bg-page-background py-10 border-t border-divider-subtle"
>
  <div class="container mx-auto px-6 flex justify-between items-center">
    <p class="text-text-secondary">© 2015 - 2022 Brave Software, Inc. | All rights reserved | <a class="link" href="/refunds-and-returns/" data-sveltekit-reload>Refunds & Returns</a></p>
    <p class="not-italic text-text-secondary">Email: <a class="link" href="mailto:merch@brave.com" target="_blank" rel="noreferrer noopener">merch@brave.com</a></p>
  </div>
</footer>
