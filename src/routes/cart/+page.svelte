<script lang="ts">
  import { contextKey } from '$lib/cartStore';
  import QuantitySelector from '$lib/QuantitySelector.svelte';
  import { formatPrice } from '$lib/utils';
  import type { IconName } from '@brave/leo/icons/meta';
  import Button from '@brave/leo/src/components/button/button.svelte';
  import Icon from '@brave/leo/src/components/icon/icon.svelte';
  import type { CountryCode } from 'libphonenumber-js/max';
  import { getExampleNumber } from 'libphonenumber-js/max';
  import examples from 'libphonenumber-js/mobile/examples';
  import { getContext } from 'svelte';
  import { slide } from 'svelte/transition';
  import type { ActionData, PageData, SubmitFunction } from './$types';
  import { enhance } from '$app/forms';

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
  $: ({ countries, statesByCountry, countryCallingCodes } = data);
  export let form: ActionData;

  const providers = ['stripe', 'radom'] as const;
  type Provider = (typeof providers)[number];
  type SubmitButton = {
    text: string;
    action: string;
    icon: IconName;
    isLoading: boolean;
  };
  const submitButtons: Record<Provider, SubmitButton> = {
    stripe: {
      text: 'Credit card',
      action: '?/purchaseCreditCard',
      icon: 'payment-stripe-color',
      isLoading: false
    },
    radom: {
      text: 'Crypto',
      action: '?/purchaseCrypto',
      icon: 'payment-radom-color',
      isLoading: false
    }
  };

  const submitFunction: SubmitFunction = ({ submitter }) => {
    const id = submitter.id as Provider;
    submitButtons[id].isLoading = true;

    return ({ update }) => {
      submitButtons[id].isLoading = false;
      update();
    };
  };

  let showShippingAddress = form?.errors?.shippingAddress?.hasErrors;
  let shippingCountryChoice: string = form?.values?.country_code || '';
  let phoneNumber = form?.values?.phone || '';
  let callingCodeChoice = form?.values?.calling_code || 'US+1';
  $: [callingCodeCountry] = callingCodeChoice.split('+');

  let phoneExample: string;
  $: {
    const exampleNumber = getExampleNumber(callingCodeCountry as CountryCode, examples);
    phoneExample = exampleNumber?.formatNational() || '(201) 555-0123';
  }

  function updateCountryCallingCode(e: any) {
    callingCodeChoice = countryCallingCodes[e.target.value]?.key || callingCodeChoice;
  }
</script>

{#if $cartStore.length <= 0}
  <div class="flex flex-col justify-center items-center pt-[8vh]">
    <h2 class="text-heading-h2 pb-xl">Nothing in your cart</h2>
    <Button href="/categories/all/" size="large">Browse products</Button>
  </div>
{:else}
  <h1 class="text-heading-h1 pb-2xl [view-transition-name:page-name]">Shopping cart</h1>

  {#if form?.errors?.cartEmpty}
    <div class="flex flex-col justify-center items-center pt-[8vh]">
      <h2 class="text-heading-h2 pb-xl">
        Hmm... looks like you haven't put anything in your cart.
      </h2>
      <Button href="/categories/all/" size="large">Browse products</Button>
    </div>
  {/if}

  {#if form?.errors?.somethingWentWrong}
    <div class="flex flex-col justify-center items-center pt-[8vh]">
      <h2 class="text-heading-h2 pb-xl">
        Something went wrong on our end. Please try again later.
      </h2>
    </div>
  {/if}

  <form
    use:enhance={submitFunction}
    method="post"
    class="grid max-lg:grid-rows-[1fr_auto] lg:grid-cols-[3fr_2fr] gap-7xl h-[stretch]"
  >
    <!-- Disable submit on 'Enter' since user needs to choose between payment options -->
    <button type="submit" disabled style="display: none" aria-hidden="true"></button>
    <section id="cart-items">
      {#each $cartStore as { variant, quantity }, i (variant.id)}
        <article
          class="grid sm:grid-cols-[165px_1fr] gap-2xl border-t last-of-type:border-b border-divider-subtle/40 py-3xl"
        >
          <div class="flex flex-col">
            <header class="flex flex-col sm:flex-row justify-between gap-x-4xl gap-y-xl">
              <h2 class="text-heading-h4">
                <a href={variant.permalink}>{variant.details.name}</a>
              </h2>
              <p><strong class="sm:hidden">Price: </strong>{formatPrice(variant.details.price)}</p>
            </header>
            <div class="flex flex-col h-full">
              {#if variant.details.size}
                <p><strong>Size:</strong> {variant.details.size}</p>
              {/if}
              {#if variant.details.color}
                <p><strong>Color:</strong> {variant.details.color}</p>
              {/if}
              <div class="py-m flex items-center">
                <strong class="pr-l">Quantity:</strong>
                <QuantitySelector
                  {quantity}
                  on:increment={() => updateQuantity(variant.id, quantity + 1)}
                  on:decrement={() => updateQuantity(variant.id, quantity - 1)}
                />
              </div>
              <span class="block mt-auto">
                <Button kind="plain" type="button" onClick={() => removeFromCart(variant.id)}
                  >Remove</Button
                >
              </span>
            </div>
          </div>
          <img
            class="order-first rounded-m w-full max-w-sm sm:max-w-[150px] shadow-gray-20 drop-shadow-02"
            src={variant.details.files.at(-1).preview_url}
            alt="Thumbnail for {variant.details.name}"
          />
          <input type="hidden" name={`items[${i}][id]`} value={variant.id} />
          <input type="hidden" name={`items[${i}][quantity]`} value={quantity} />
        </article>
      {/each}
    </section>

    <section id="total" class="cart-total">
      <div
        class="shadow-02 lg:rounded-m p-2xl sticky top-[20px] bg-container-background border border-divider-subtle/40"
      >
        <button
          on:click={() => (showShippingAddress = !showShippingAddress)}
          class="lg:hidden absolute top-xl right-xl focus-visible:shadow-focus-state outline-none rounded-s transition-transform duration-200"
          class:hidden={!showShippingAddress}
          type="button"
        >
          <!-- The data-prevent-innerHTML is used to prevent SvelteKit from rendering the SVG via innerHTML and thereby breaking our TrustedTypes policy -->
          <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"
            ><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.992 5.992a.85.85 0 0 0 0 1.202L10.798 12l-4.81 4.81a.85.85 0 1 0 1.202 1.202l4.81-4.81 4.806 4.806a.85.85 0 0 0 1.202-1.202L13.202 12l4.81-4.81a.85.85 0 1 0-1.202-1.202L12 10.798 7.194 5.992a.85.85 0 0 0-1.202 0Z"
              fill="#6B7084"
              data-prevent-innerHTML={Math.random() ? '' : ''}
            /></svg
          >
        </button>
        <p class="pb-m">
          <strong>Subtotal ({totalItems} items):</strong>
          {formatPrice(cartTotal)}
        </p>

        {#if showShippingAddress}
          <div transition:slide|local class="shipping_address">
            <h3 class="text-default-semibold pb-xl">Shipping address</h3>
            <div class="form-control">
              <label for="shippingAddress[name]"
                >Name <span class="label-explanation">(if different from billing name)</span></label
              >
              <input
                value={form?.values?.name || ''}
                name="shippingAddress[name]"
                id="shippingAddress[name]"
                type="text"
                placeholder="Jane Smith"
              />
            </div>

            <div
              class="form-control required"
              class:errors={form?.errors?.shippingAddress?.address1?.missing}
            >
              <label for="shippingAddress[address1]">Address</label>
              <input
                value={form?.values?.address1 || ''}
                name="shippingAddress[address1]"
                id="shippingAddress[address1]"
                type="text"
                placeholder="580 Howard St. Unit 402"
                required
              />
            </div>

            <div class="input-group">
              <div
                class="form-control required"
                class:errors={form?.errors?.shippingAddress?.city?.missing}
              >
                <label for="shippingAddress[city]">City</label>
                <input
                  value={form?.values?.city || ''}
                  name="shippingAddress[city]"
                  id="shippingAddress[city]"
                  type="text"
                  placeholder="San Francisco"
                  required
                />
              </div>

              <div
                class="form-control required"
                class:errors={form?.errors?.shippingAddress?.zip?.missing}
              >
                <label for="shippingAddress[zip]">Postal code</label>
                <input
                  value={form?.values?.zip || ''}
                  name="shippingAddress[zip]"
                  id="shippingAddress[zip]"
                  type="text"
                  placeholder="94105"
                  required
                />
              </div>
            </div>

            <div class="input-group">
              <div
                class="form-control required"
                class:errors={form?.errors?.shippingAddress?.country_code?.missing}
              >
                <label for="shippingAddress[country_code]">Country</label>
                <div class="input-select">
                  <select
                    bind:value={shippingCountryChoice}
                    on:change={updateCountryCallingCode}
                    name="shippingAddress[country_code]"
                    id="shippingAddress[country_code]"
                    required
                  >
                    <option value="" disabled selected>Select your country</option>
                    {#each countries as country}
                      <option value={country.code}>{country.name}</option>
                    {/each}
                  </select>
                </div>
              </div>

              <div
                class="form-control required"
                class:errors={form?.errors?.shippingAddress?.state_code?.missing}
              >
                <label for="shippingAddress[state_code]">Region</label>
                <div class="input-select">
                  <select
                    value={form?.values?.state_code}
                    name="shippingAddress[state_code]"
                    id="shippingAddress[state_code]"
                    required
                  >
                    {#if shippingCountryChoice && !statesByCountry[shippingCountryChoice]?.length}
                      <option value="N/A" selected>N/A</option>
                    {:else}
                      <option value="" disabled selected>Select your region</option>
                    {/if}
                    {#each statesByCountry[shippingCountryChoice] || [] as state}
                      <option value={state.code}>{state.name}</option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>

            <div
              class="form-control phone-number"
              class:errors={form?.errors?.shippingAddress?.phone?.invalid}
            >
              <label for="shippingAddress[phone]">Phone number</label>
              <div class="input-select phone-number__country">
                <select
                  bind:value={callingCodeChoice}
                  name="shippingAddress[calling_code]"
                  id="shippingAddress[calling_code]"
                  required
                >
                  {#each Object.values(countryCallingCodes) as country}
                    <option value={country.key}>{country.code} +{country.callingCode}</option>
                  {/each}
                </select>
              </div>
              <input
                bind:value={phoneNumber}
                class="phone-number__number"
                name="shippingAddress[phone]"
                id="shippingAddress[phone]"
                type="text"
                placeholder={phoneExample}
              />
              {#if form?.errors?.shippingAddress?.phone?.invalid}
                <p class="text-systemfeedback-error-icon text-small-regular pt-s">
                  Your phone number is invalid.
                </p>
              {/if}
              <p class="help-text">
                Providing a telephone number is optional, however if there is a failure to ship on
                account of the carrier being unable to reach the recipient, you could incur
                reshipment costs after the package is returned.
              </p>
            </div>
          </div>
        {/if}

        <div class="pt-xl flex gap-m">
          {#if !showShippingAddress}
            <Button size="large" type="button" onClick={() => (showShippingAddress = true)}>
              Enter shipping address
            </Button>
          {:else}
            {#each Object.entries(submitButtons) as [name, submitButton]}
              <Button
                id={name}
                kind="outline"
                type="submit"
                formaction={submitButton.action}
                isLoading={submitButton.isLoading}
              >
                <Icon
                  --leo-icon-size="var(--leo-icon-xl)"
                  --leo-icon-height="100%"
                  name={submitButton.icon}
                  slot="icon-before"
                />
                {submitButton.text}
              </Button>
            {/each}
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
    gap: 8px;
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

    & .label-explanation,
    & .help-text {
      @apply text-small-regular;

      // Left padding to account for invisible border on text inputs
      padding-left: 2px;
      padding-top: 8px;
      color: theme('colors.text.secondary');
    }

    &.required label::after {
      @apply text-small-regular;
      content: '*';
      color: theme('colors.systemfeedback.error-icon');
      padding-left: 4px;
    }

    &.errors input[type='text'],
    &.errors select {
      --bg: theme('colors.systemfeedback.error-background');
    }

    &.disabled {
      --label-text-color: theme('colors.text.secondary');
    }

    &.phone-number {
      display: grid;
      grid-auto-rows: auto;
      column-gap: 3px;
      row-gap: 8px;
      grid-template:
        'label'
        'country_code'
        'number'
        / 1fr;

      label {
        padding-bottom: 0;
        grid-area: label;
      }

      .help-text {
        padding-top: 0;
      }

      .phone-number__country {
        grid-area: country_code;
      }

      .phone-number__country select {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      .phone-number__number {
        grid-area: number;
      }

      .phone-number__number {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

      & *:nth-child(n + 4) {
        grid-column: 1 / -1;
      }
    }

    @screen xs {
      &.phone-number {
        grid-template:
          'label label'
          'country_code number'
          / 1fr 4fr;
      }
    }
  }

  input[type='text'],
  select {
    @apply text-default-regular;

    --text-color: theme('colors.text.primary');
    --placeholder-text-color: theme('colors.text.tertiary');
    --bg: theme('colors.page.background');
    --radius: theme('borderRadius.m');
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
      --border-color: theme('colors.divider.subtle/40%');
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
      content: '';
      display: block;
      width: var(--size);
      height: var(--size);
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10.471 12.763a.667.667 0 0 1-.942 0L4.945 8.18a.667.667 0 1 1 .943-.943L10 11.349l4.112-4.112a.667.667 0 1 1 .943.943l-4.584 4.583Z' fill='%236B7084'/%3E%3C/svg%3E");
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
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
      color: var(--label-text-color);
    }

    & input[type='checkbox'] {
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

  @screen lg {
    .cart-total {
      position: static;
      width: auto;
      margin-bottom: 0;
      margin-left: 0;
    }
  }
</style>
