<script lang="ts">
  import { getContext } from 'svelte';
  import { contextKey } from '$lib/cartStore';
  import { formatPrice } from '$lib/utils';
  import Button from '@brave/leo/web-components/button/button.svelte';
  import QuantitySelector from '$lib/QuantitySelector.svelte';
  import { slide } from 'svelte/transition';
  import type { PageData } from './$types';

  const { cartStore, removeFromCart, updateQuantity }: any = getContext(contextKey);

  type CartReduction = { cartTotal: number; totalItems: number };
  $: ({ cartTotal, totalItems } = $cartStore.reduce(
    ({ cartTotal, totalItems }: CartReduction, item: any) => {
      return {
        cartTotal: cartTotal + parseFloat(item.variant.details.price) * item.quantity,
        totalItems: totalItems + item.quantity
      };
    },
    { cartTotal: 0, totalItems: 0 }
  ));

  export let data: PageData;
  $: ({ countries, statesByCountry } = data);
  export let form: import('./$types').ActionData;

  let showShippingAddress = form?.shippingAddress?.hasErrors;
  let shippingCountryChoice: string;
</script>

{#if $cartStore.length <= 0}
  <div class="flex flex-col justify-center items-center pt-[8vh]">
    <h2 class="text-h2 pb-4">Nothing in your cart</h2>
    <Button href="/categories/all/" size="large">Browse products</Button>
  </div>
{:else}
  <h1 class="text-h1 pb-6">Shopping cart</h1>

  {#if form?.cartEmpty}
    <div class="flex flex-col justify-center items-center pt-[8vh]">
      <h2 class="text-h2 pb-4">Hmm... looks like you haven't put anything in your cart.</h2>
      <Button href="/categories/all/" size="large">Browse products</Button>
    </div>
  {/if}

  {#if form?.somethingWentWrong}
    <div class="flex flex-col justify-center items-center pt-[8vh]">
      <h2 class="text-h2 pb-4">Something went wrong on our end. Please try again later.</h2>
    </div>
  {/if}

  <form method="post" class="grid max-md:grid-rows-[1fr_auto] md:grid-cols-[3fr_2fr] gap-20">
    <section id="cart-items">
      {#each $cartStore as { variant, quantity }, i (variant.id)}
        <article
          class="grid sm:grid-cols-[165px_1fr] gap-6 border-t last-of-type:border-b border-divider-subtle py-8"
        >
          <div class="flex flex-col">
            <header class="flex flex-col sm:flex-row justify-between">
              <h1 class="text-h3">
                <a href={variant.permalink}>{variant.details.name}</a>
              </h1>
              <p><strong class="sm:hidden">Price: </strong>{formatPrice(variant.details.price)}</p>
            </header>
            <div class="flex flex-col h-full">
              {#if variant.details.size}
                <p><strong>Size:</strong> {variant.details.size}</p>
              {/if}
              {#if variant.details.color}
                <p><strong>Color:</strong> {variant.details.color}</p>
              {/if}
              <div class="py-2 flex items-center">
                <strong class="pr-3">Quantity:</strong>
                <QuantitySelector
                  {quantity}
                  on:increment={() => updateQuantity(variant.id, quantity + 1)}
                  on:decrement={() => updateQuantity(variant.id, quantity - 1)}
                />
              </div>
              <span class="block mt-auto">
                <Button kind="tertiary" type="button" on:click={() => removeFromCart(variant.id)}>Remove</Button>
              </span>
            </div>
          </div>
          <img
            class="order-first rounded-8 w-full max-w-sm sm:max-w-[150px] shadow-gray-20 shadow-04"
            src={variant.details.files.at(-1).preview_url}
            alt="Thumbnail for {variant.details.name}"
          />
          <input type="hidden" name={`items[${i}][id]`} value={variant.id} />
          <input type="hidden" name={`items[${i}][quantity]`} value={quantity} />
        </article>
      {/each}
    </section>

    <section id="total" class="cart-total">
      <div class="shadow-04 md:rounded-8 p-6 sticky top-5 bg-container-background border border-divider-subtle">
        <button on:click={() => showShippingAddress = !showShippingAddress} class="md:hidden absolute top-4 right-4 focus-visible:shadow-focus-state outline-none rounded-4 transition-transform duration-200" class:hidden={!showShippingAddress} type="button">
          <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.992 5.992a.85.85 0 0 0 0 1.202L10.798 12l-4.81 4.81a.85.85 0 1 0 1.202 1.202l4.81-4.81 4.806 4.806a.85.85 0 0 0 1.202-1.202L13.202 12l4.81-4.81a.85.85 0 1 0-1.202-1.202L12 10.798 7.194 5.992a.85.85 0 0 0-1.202 0Z" fill="#6B7084"/></svg>
        </button>
        <p class="pb-2">
          <strong>Subtotal ({totalItems} items):</strong>
          {formatPrice(cartTotal)}
        </p>

        {#if showShippingAddress}
          <div in:slide class="shipping_address">
            <h3 class="text-default-semibold pb-4">Shipping address</h3>
            <div class="form-control required" class:errors={form?.shippingAddress?.address1?.missing}>
              <label for="shippingAddress[address1]">Address</label>
              <input name="shippingAddress[address1]" id="shippingAddress[address1]" type="text" placeholder="Address" required />
            </div>

            <div class="input-group">
              <div class="form-control required" class:errors={form?.shippingAddress?.city?.missing}>
                <label for="shippingAddress[city]">City</label>
                <input name="shippingAddress[city]" id="shippingAddress[city]" type="text" placeholder="City" required />
              </div>

              <div class="form-control required" class:errors={form?.shippingAddress?.zip?.missing}>
                <label for="shippingAddress[zip]">Zip code</label>
                <input name="shippingAddress[zip]" id="shippingAddress[zip]" type="text" placeholder="Zip code" required />
              </div>
            </div>

            <div class="input-group">
              <div class="form-control required" class:errors={form?.shippingAddress?.country_code?.missing}>
                <label for="shippingAddress[country_code]">Country</label>
                <div class="input-select">
                  <select bind:value={shippingCountryChoice} name="shippingAddress[country_code]" id="shippingAddress[country_code]" required>
                    <option value="" disabled selected>Select your country</option>
                    {#each countries as country}
                      <option value={country.code}>{country.name}</option>
                    {/each}
                  </select>
                </div>
              </div>

              <div class="form-control required" class:errors={form?.shippingAddress?.state_code?.missing}>
                <label for="shippingAddress[state_code]">State</label>
                <div class="input-select">
                  <select name="shippingAddress[state_code]" id="shippingAddress[state_code]" required>
                    {#if shippingCountryChoice && !statesByCountry[shippingCountryChoice]?.length}
                      <option value="N/A" selected>N/A</option>
                    {:else}
                      <option value="" disabled selected>Select your state</option>
                    {/if}
                    {#each statesByCountry[shippingCountryChoice] || [] as state}
                      <option value={state.code}>{state.name}</option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>
          </div>
        {/if}

        <div class="pt-4">
          {#if !showShippingAddress}
            <Button size="large" type="button" on:click={() => (showShippingAddress = true)}>Enter shipping address</Button>
          {:else}
            <Button size="large" type="submit">Proceed to checkout</Button>
          {/if}
        </div>
      </div>
    </section>
  </form>
{/if}

<style lang="scss">
  .cart-total {
    position: sticky;
    bottom: 0;
    width: 100vw;
    margin-bottom: -5rem; // padding for parent container
    margin-left: calc(((100vw - 100%) / 2) * -1);
  }

  .input-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 3px;

    & .form-control input,
    & .form-control select {
      border-radius: 0;
    }

    & .form-control:first-child input,
    & .form-control:first-child select {
      border-bottom-left-radius: theme('borderRadius.8');
      border-top-left-radius: theme('borderRadius.8');
    }

    & .form-control:last-child input,
    & .form-control:last-child select {
      border-bottom-right-radius: theme('borderRadius.8');
      border-top-right-radius: theme('borderRadius.8');
    }
  }

  .form-control {
    --label-text-color: theme('colors.text.primary');

    display: flex;
    flex-direction: column;
    padding-bottom: 14px;
    label {
      @apply text-small-semibold;

      padding-bottom: 8px;
      color: var(--label-text-color);
    }

    &.required label::after {
      @apply text-small-regular;
      content: '*';
      color: theme('colors.systemfeedback.error.icon');
      padding-left: 4px;
    }

    &.errors input[type=text],
    &.errors select {
      --bg: theme('colors.systemfeedback.error.background');
    }

    &.disabled {
      --label-text-color: theme('colors.text.secondary');
    }
  }

  input[type=text],
  select {
    @apply text-default-regular;

    --text-color: theme('colors.text.primary');
    --placeholder-text-color: theme('colors.text.secondary');
    --bg: theme('colors.container.highlight');
    --radius: theme('borderRadius.8');
    --padding-y: 10px;
    --padding-x: 8px;
    --border-color: transparent;
    --box-shadow: none;

    color: var(--text-color);
    background: var(--bg);
    border-radius: var(--radius);
    padding: var(--padding-y) var(--padding-x);
    border: 1px solid var(--border-color);
    box-shadow: var(--box-shadow);

    &::placeholder {
      color: var(--placeholder-text-color);
    }

    &:hover {
      --border-color: theme('colors.divider.subtle');
      --box-shadow: theme('boxShadow.02');
    }

    &:focus-visible {
      outline: none;
      --box-shadow: theme('boxShadow.focus-state');
    }

    &:disabled {
      --text-color: theme('colors.text.disabled');
      --placeholder-text-color: theme('colors.text.disabled');
      --bg: theme('colors.container.disabled');
    }
  }

  .input-select {
    position: relative;

    select {
      appearance: none;
      width: 100%;

      &:invalid {
        color: theme('colors.text.secondary');
      }
    }

    &::after {
      --size: 20px;
      content: "";
      display: block;
      width: var(--size);
      height: var(--size);
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10.471 12.763a.667.667 0 0 1-.942 0L4.945 8.18a.667.667 0 1 1 .943-.943L10 11.349l4.112-4.112a.667.667 0 1 1 .943.943l-4.584 4.583Z' fill='%236B7084'/%3E%3C/svg%3E");
      position: absolute;
        right: 8px;
        top: 50%;
      transform: translateY(-50%);
    }
  }

  .input-checkbox {
    --size: 20px;
    --label-text-color: theme('colors.text.primary');
    --icon-color: theme('colors.icon.default');

    display: grid;
    grid-template-columns: var(--size) auto;
    gap: 8px;

    & label {
      @apply text-default-regular;

      order: theme('order.last');
      color: var(--label-text-colorl);
    }

    & input[type=checkbox] {
      --bg: transparent;
      --box-shadow: none;

      background-color: var(--bg);
      appearance: none;
      border: 2px solid var(--icon-color);
      border-radius: 2px;
      box-shadow: var(--box-shadow);
      position: relative;

      &:focus-visible {
        --box-shadow: theme('boxShadow.focus-state');
      }

      &:checked {
        --bg: theme('colors.icon.interactive');
        --icon-color: theme('colors.icon.interactive');

        &::after {
          content: '';
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.528.333A1.198 1.198 0 0 0 13.85.56L5.973 10.9l-3.93-3.93A1.197 1.197 0 0 0 .352 8.664l4.898 4.898a1.197 1.197 0 0 0 1.799-.121L15.755 2.01c.4-.526.3-1.277-.227-1.678Z' fill='%23ffffff'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          width: 10px;
          height: 8px;
          position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
      }
    }

    &.disabled {
      --label-text-color: theme('colors.text.secondary');
    }
  }

  @screen md {
    .cart-total {
      position: static;
      width: auto;
      margin-bottom: 0;
      margin-left: 0;
    }
  }
</style>
