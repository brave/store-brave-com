<script lang="ts">
  import { getContext } from 'svelte';
  import { page as currentPage } from "$app/stores";
  import { contextKey } from '$lib/cartStore';
  import CartButton from '$lib/CartButton.svelte';
  import Icon from "@brave/leo/src/components/icon/icon.svelte";

  const { cartStore }: any = getContext(contextKey);

  $: totalCartItems = $cartStore.reduce((sum: number, item: App.CartItem) => sum += item.quantity, 0);

  const pages = [
    { name: 'Home', permalink: '/' },
    { name: 'Privacy', permalink: 'https://brave.com/privacy/website/#brave-merch-store', newTab: true }
  ];

  let mobileMenuOpen = false;
  const openMobileMenu = () => mobileMenuOpen = true;
  const closeMobileMenu = () => mobileMenuOpen = false;
</script>

<div
  class="max-sm:container max-sm:mx-auto xl:container xl:mx-auto px-2xl flex justify-between items-stretch"
>
  <button
    aria-label="open mobile menu"
    class="md:hidden nav-item inline-flex self-center"
    on:click={openMobileMenu}
  >
    <Icon name="hamburger-menu" />
  </button>

  <a class="inline-flex items-center" href="/">
    <img class="logo inline dark:hidden" src="/images/brave-logo.svg" alt="Brave Merch Store" />
    <img
      class="logo hidden dark:inline"
      src="/images/brave-logo-dark.svg"
      alt="Brave Merch Store"
    />
    <span class="logo-tag text-heading-h2 whitespace-nowrap text-text-primary opacity-90 ml-m font-normal">| merch</span>
  </a>

  <nav class="flex gap-x-3xl">
    <ul class="hidden md:flex items-center gap-x-3xl">
      {#each pages as page}
        <li class="nav-item after:content-[''] h-full flex items-center" class:active={page.permalink === $currentPage.url.pathname}><a class="nav-link" href={page.permalink} target={page.newTab ? "_blank" : null}>{page.name}</a></li>
      {/each}
    </ul>
    <span class="nav-item after:content-none md:after:content-[''] flex items-center" class:active={"/cart/" === $currentPage.url.pathname}>
      <CartButton ref="cart-button" itemCount={totalCartItems} />
    </span>
  </nav>
</div>

<!-- BEGIN mobile nav -->
<div class="mobile-menu fixed top-0 left-0 min-h-screen w-screen z-10" class:open={mobileMenuOpen}>
  <nav class="mobile-menu__nav w-4/5 bg-container-background min-h-screen z-10 pl-2xl pr-xl py-[20px]">
    <div class="flex justify-between pb-5xl">
      <a class="flex items-center" href="/" on:click={closeMobileMenu}>
        <img class="logo inline dark:hidden" src="/images/brave-logo.svg" alt="Brave Merch Store" />
        <img
          class="logo hidden dark:inline"
          src="/images/brave-logo-dark.svg"
          alt="Brave Merch Store"
        />
        <span class="logo-tag text-heading-h2 whitespace-nowrap text-primary opacity-90 ml-m font-normal">| merch</span>
      </a>

      <button aria-label="open mobile menu" class="nav-item" on:click={closeMobileMenu}>
        <Icon name="close" />
      </button>
    </div>

    <ul class="flex flex-col gap-y-3xl">
      {#each pages as page}
        <li class="nav-item h-full flex items-center" class:active={page.permalink === $currentPage.url.pathname}><a on:click={closeMobileMenu} class="nav-link" href={page.permalink}>{page.name}</a></li>
      {/each}
    </ul>
  </nav>
</div>
<!-- END mobile nav -->

<style lang="scss">

  .mobile-menu {
    visibility: hidden;
    transition: visibility 250ms ease-in, backdrop-filter 250ms ease-in, background-color 250ms ease-in;

    &__nav {
      transform: translateX(-100%);
      transition: transform 200ms ease-in-out;
    }

    &.open {
      backdrop-filter: blur(8px);
      background-color: theme('colors.dialogs.scrim-background/0.35');
      visibility: visible;
    }

    &.open &__nav {
      transform: translateX(0);
    }
  }

  .nav-item {
    color: theme('colors.text.secondary');

    &.active {
      position: relative;
      color: theme('colors.text.interactive');

      &::after {
        display: block;
        width: 4px;
        height: 150%;
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
        background: theme('colors.text.interactive');

        position: absolute;
          top: 50%;
          left: -1.5rem;
        transform: translateY(-50%);
      }
    }

    &:hover {
      color: theme('colors.text.interactive');
    }

    :global(a),
    :global(button) {
      @apply text-components-navbutton;
      color: currentColor;
      display: block;
    }
  }

  .logo {
    height: clamp(1.5rem, 0.0556rem + 8.8889vw, 2rem);
  }

  .logo-tag {
    line-height: 1;
    font-size: clamp(1rem, 0.2778rem + 4.4444vw, 1.25rem);
  }

  @screen md {
    .nav-item.active::after {
      width: 115%;
      height: 4px;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;

      top: unset;
      bottom: -1.25rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>