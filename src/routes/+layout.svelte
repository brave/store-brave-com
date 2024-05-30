<script context="module" lang="ts">
  import { setIconBasePath } from "@brave/leo/src/components/icon/icon.svelte";
  setIconBasePath("/nala-icons");

  export const viewTransition = writable(null);
</script>

<script lang="ts">
  // TODO: add more info for tracking without javascript in app.html:
  // https://developer.matomo.org/api-reference/tracking-api

  import { onMount, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import DOMPurify from 'isomorphic-dompurify';
  import { PUBLIC_ASSETS_PATH } from '$env/static/public';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { afterNavigate, onNavigate } from '$app/navigation';
  import type { Variant } from '$lib/graphql/types';
  import { cartStorageKey, contextKey } from '$lib/cartStore';
  import Toast, { Kind as ToastKind } from '$lib/Toast.svelte';
  import Navigation from '$lib/Navigation.svelte';

  import '@fontsource/poppins/400.css'
  import '@fontsource/poppins/500.css'
  import '@fontsource/poppins/600.css'
  import '@fontsource-variable/inter'
  import '../app.scss';

  let matomoPolicy;
  if (browser) {
    // @ts-ignore
    if (typeof window.trustedTypes == 'undefined') window.trustedTypes={createPolicy:(n, rules) => rules};

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

    // @ts-ignore
    trustedTypes.createPolicy('default', {
      createHTML: (dirty: string) => DOMPurify.sanitize(dirty, {RETURN_TRUSTED_TYPE: true})
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

  onNavigate(({ from, to, ...navigation }) => {
    const productToProductNav = to?.params?.product && from?.params?.product;
    /*
     * Don't transition if simply switching between variants of same product
     * or if clicking a link to the same page
     */
    const shouldTransition = productToProductNav
      ? to?.params?.product !== from?.params?.product
      : to?.url.pathname !== from?.url.pathname;
    // @ts-ignore
    if (!shouldTransition || !document.startViewTransition) return;

    return new Promise((resolve) => {
      // @ts-ignore
      $viewTransition = document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<svelte:head>
  <title>{$page.error ? $page.status : $page.data.title} | Brave Merch Store</title>
  <link rel="preconnect" crossorigin="anonymous" href={PUBLIC_ASSETS_PATH} />
</svelte:head>

{#if showNewItemToast}
  <Toast kind={ToastKind.success} message="Item(s) added to shopping cart." />
{/if}

<header class="py-[20px] border-b border-divider-subtle/40 [view-transition-name:header]">
  <Navigation />
</header>

<main
  class="max-sm:container max-sm:mx-auto xl:container xl:mx-auto px-2xl pt-4xl pb-7xl flex flex-col [view-transition-name:main]"
>
  <slot />
</main>

<footer
  data-theme="dark"
  class="text-text-primary bg-page-background py-4xl border-t border-divider-subtle/40 [view-transition-name:footer]"
>
  <div class="max-sm:container max-sm:mx-auto xl:container xl:mx-auto flex max-md:flex-col md:items-center px-2xl gap-l">
    <div class="md:ml-auto flex flex-col gap-m text-large-regular">
      <a class="link" href="/faq/">FAQ</a>
      <a class="link" href="/refunds-and-returns/">Refunds & Returns</a>
      <p class="not-italic text-text-secondary">Email: <a class="link" href="mailto:merch@brave.com" target="_blank" rel="noreferrer noopener">merch@brave.com</a></p>
    </div>
    <p class="text-x-small-regular xs:text-small-regular md:text-large-regular text-text-secondary md:order-first">© 2015 - {new Date().getFullYear()} Brave Software, Inc. | All rights reserved</p>
  </div>
</footer>

<style>
  :root::view-transition-old(main) {
    animation:
      90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
      300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
  }

  :root::view-transition-new(main) {
    animation:
      210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
      300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
  }

  @media (prefers-reduced-motion) {
    :root::view-transition-group(*),
    :root::view-transition-old(*),
    :root::view-transition-new(*) {
      animation: none !important;
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes fade-out {
    to {
      opacity: 0;
    }
  }

  @keyframes slide-from-right {
    from {
      transform: translateX(30px);
    }
  }

  @keyframes slide-to-left {
    to {
      transform: translateX(-30px);
    }
  }
</style>
