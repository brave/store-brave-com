<script>
  import { getContext } from 'svelte';
  import { contextKey } from '$lib/cartStore';
  import Button from '@brave/leo/web-components/button/button.svelte';
  import MeasurementDetails from './MeasurementDetails.svelte';
  import QuantitySelector from '$lib/QuantitySelector.svelte';
  import Breadcrumbs from '$lib/Breadcrumbs.svelte';
  import { formatPrice } from '$lib/utils';
  import { goto } from '$app/navigation';

  const { addToCart } = getContext(contextKey);

  /**
   * Sort sizes
   * @param {import("$lib/graphql/types").Variant} a
   * @param {import("$lib/graphql/types").Variant} b
   */
  const sortSizes = (a, b) => {
    const sizeOrder = [
      '11oz',
      '15oz',
      '3″×3″',
      '4″×4″',
      '5.5″×5.5″',
      '18″×18″',
      '22″×22″',
      '"S/M"',
      '"M/"',
      'Samsung Galaxy S10e',
      'Samsung Galaxy S10',
      'Samsung Galaxy S10+',
      'iPhone 7/8',
      'iPhone 7 Plus/8 Plus',
      'iPhone XR',
      'iPhone X/XS',
      'iPhone XS Max',
      'iPhone 11 Pro',
      'iPhone 11 Pro Max',
      '3-6M',
      '6-12M',
      '18-24M',
      '12-18M',
      'XS',
      'S',
      'M',
      'L',
      'XL',
      '2XL',
      '3XL',
      '4XL',
      '5XL'
    ];

    const aSizeOrder = sizeOrder.indexOf(a.details.size.toUpperCase());
    const bSizeOrder = sizeOrder.indexOf(b.details.size.toUpperCase());

    return aSizeOrder - bSizeOrder;
  };

  /**
   * Sort colors
   * @typedef {{ primary: string, secondary: string }} Color
   * @param {Color} a
   * @param {Color} b
   */
  const sortColors = (a, b) => {
    return parseInt(b.primary.slice(1), 16) - parseInt(a.primary.slice(1), 16);
  };

  /** @type {import('./$types').PageData} */
  export let data;

  $: ({ product, variant } = data);
  $: currency = variant.details.currency;
  $: price = formatPrice(variant.details.price, currency);

  $: colors = product?.filters?.colors?.sort(sortColors);
  $: sizeVariants =
    product?.variants?.filter((v) => v.details.color === variant.details.color)?.sort(sortSizes) ||
    [];
  $: colorVariants =
    product?.variants?.filter((v) => v.details.size === variant.details.size) || [];

  $: sizeTables = [...(product?.sizingCharts?.size_tables ?? [])].reverse();

  /**
   * @param {{ name: string, primary: string, secondary?: string }} color
   * @return {string}
   */
  const getColorBg = (color) => {
    if (color.secondary) {
      return `linear-gradient(135deg, ${color.primary} 50%, ${color.secondary} 50%)`;
    } else {
      return color.primary;
    }
  };

  /**
   * @param {string} color
   * @return {import("$lib/graphql/types").Variant|undefined}
   */
  const getColorVariantFromColor = (color) => {
    return colorVariants?.find((v) => color === v.details.color);
  };

  let purchaseQuantity = 1;

  /**
   * @param {Event} e
   * @return {void}
   */
  const handleVariantClick = (e) => {
    e.preventDefault();
    // @ts-ignore
    goto(e.currentTarget.href, { replaceState: true })
  }

  /** @type {Array<{ label: string, link?: string }>} */
  let breadcrumbs;
  $: {
    breadcrumbs = [{ label: "All products", link: "/categories/all/" }]
    if (product?.category?.name) {
      breadcrumbs = [...breadcrumbs, {
        label: product.category.name,
        link: `/categories/${product.category.slug}/`
      }];
    }
    breadcrumbs = [...breadcrumbs, {
      label: product?.name ?? ""
    }];
  }
</script>

<article class="product-layout w-full max-w-screen-lg mx-auto">
  <Breadcrumbs ref="product-layout__breadcrumbs" crumbs={breadcrumbs} />

  <img
    class="w-full shadow-02 rounded-2 max-w-screen-xs product-layout__image mx-auto md:mx-0"
    src={variant?.details.files.at(-1).preview_url}
    alt="{product?.name} product image"
  />

  <header class="product-layout__header flex flex-wrap items-center">
    <h1 class="text-h1 pb-2 w-full">{product?.name}</h1>
    <p class="text-h3 pr-6">{price}</p>
  </header>

  <section class="product-layout__body flex flex-col md:items-start">
    {#if (product?.variants?.length ?? 0) > 1}
      <div class="pb-5 space-y-4">
        {#if colors?.length > 1}
          <div>
            <h2 class="text-x-large font-normal pb-2">
              Color: <strong class="font-semibold">{variant.details.color}</strong>
            </h2>
            <ul class="flex flex-wrap gap-2">
              {#each colors as color}
                <li>
                  <a
                    class="rounded-8 border border-gray-30 block overflow-hidden"
                    class:active-option={variant.details.color === color.name}
                    href={getColorVariantFromColor(color.name)?.permalink}
                    on:click={handleVariantClick}
                    title={color.name}
                  >
                    <span class="h-8 w-8 block" style="background: {getColorBg(color)}" />
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if sizeVariants?.length > 1}
          <div>
            <h2 class="text-x-large font-normal pb-2">
              Size: <strong class="font-semibold">{variant.details.size}</strong>
            </h2>
            <ul class="flex flex-wrap gap-2">
              {#each sizeVariants as sizeVariant}
                <li>
                  <a
                    href={sizeVariant.permalink}
                    on:click={handleVariantClick}
                    class="border-dashed border rounded-8 p-2 min-w-[40px] inline-block text-center"
                    class:active-option={sizeVariant.details.size === variant.details.size}
                  >
                    {sizeVariant.details.size}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    {/if}

    <QuantitySelector
      ref="product-quantity-selector"
      quantity={purchaseQuantity}
      on:increment={() => purchaseQuantity += 1}
      on:decrement={() => purchaseQuantity > 1 ? purchaseQuantity -= 1 : 0}
    />

    <Button size="large" on:click={() => addToCart({ variant, product, quantity: purchaseQuantity })}>
      Add to cart
    </Button>

    <p class="whitespace-pre-wrap pt-4">
      {product?.description}
    </p>
  </section>

  {#if sizeTables.length > 0}
    <section class="product-layout__sizing border-t border-divider-subtle pt-4 mt-6 grid grid-cols-[repeat(auto-fit,_minmax(290px,_1fr))] gap-8">
      {#each sizeTables as sizeTable, i}
        <div class="pt-6" class:order-last={i === 0}>
          <MeasurementDetails
            heading={i === 0 ? 'Product measurements' : 'Measure yourself'}
            details={sizeTable}
          />
        </div>
      {/each}
    </section>
  {/if}
</article>

<style lang="scss">
  .product-layout {
    display: grid;
    grid-gap: 1rem;
    grid-template-areas:
      'breadcrumbs'
      'header'
      'image'
      'body'
      'sizing';

    :global([data-ref=product-layout__breadcrumbs]) {
      grid-area: breadcrumbs
    }
    &__image {
      grid-area: image;
    }
    &__header {
      grid-area: header;
    }
    &__body {
      grid-area: body;
    }
    &__sizing {
      grid-area: sizing;
    }

    @screen md {
      grid-template-areas:
        'breadcrumbs breadcrumbs'
        'image header'
        'image body'
        'sizing sizing';
    }

    @screen lg {
      grid-template-columns: repeat(2, 1fr);
    }

    :global([data-ref="product-quantity-selector"]) {
      margin-bottom: 16px;
    }
  }

  .active-option {
    border-color: theme('colors.yellow.30');
    border-style: solid;
  }
</style>
