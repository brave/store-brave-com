<script>
  import { getContext } from 'svelte';
  import { contextKey } from '$lib/cartStore';
  import Button from '@brave/leo/src/components/button/button.svelte';
  import MeasurementDetails from './MeasurementDetails.svelte';
  import QuantitySelector from '$lib/QuantitySelector.svelte';
  import Breadcrumbs from '$lib/Breadcrumbs.svelte';
  import { formatPrice } from '$lib/utils';
  import ColorPicker from '$lib/ColorPicker.svelte';
  import SizePicker from '$lib/SizePicker.svelte';

  const { addToCart } = getContext(contextKey);

  /** @type {import('./$types').PageData} */
  export let data;

  $: ({ product, variant } = data);
  $: currency = variant.details.currency;
  $: price = formatPrice(variant.details.price, currency);

  $: sizeVariants =
    product?.variants?.filter((v) => v.details.color === variant.details.color) || [];
  $: colorVariants =
    product?.variants?.filter((v) => v.details.size === variant.details.size) || [];

  $: sizeTables = [...(product?.sizingCharts?.size_tables ?? [])].reverse();

  let purchaseQuantity = 1;

  $: defaultImage = variant?.details.files.at(-1).preview_url;
  $: currentImage = defaultImage;
  /**
   * @param {CustomEvent} e
   * @return {void}
   */
  const handleColorHover = (e) => {
    if (e.type === 'mouseleave') {
      currentImage = defaultImage;
    } else if (e.type === 'mouseenter') {
      currentImage = e.detail.colorVariant?.details.files.at(-1).preview_url;
    }
  };

  /** @type {Array<{ label: string, link?: string }>} */
  let breadcrumbs;
  $: {
    breadcrumbs = [{ label: 'All products', link: '/categories/all/' }];
    if (product?.category?.name) {
      breadcrumbs = [
        ...breadcrumbs,
        {
          label: product.category.name,
          link: `/categories/${product.category.slug}/`
        }
      ];
    }
    breadcrumbs = [
      ...breadcrumbs,
      {
        label: product?.name ?? ''
      }
    ];
  }
</script>

<article class="product-layout w-full max-w-screen-lg mx-auto">
  <Breadcrumbs ref="product-layout__breadcrumbs" crumbs={breadcrumbs} />

  <img
    class="w-full shadow-02 rounded-xs max-w-screen-xs product-layout__image mx-auto md:mx-0 [view-transition-name:product-image]"
    src={currentImage}
    alt="{product?.name} product image"
  />

  <header class="product-layout__header flex flex-wrap items-center">
    <h1 class="text-heading-h2 pb-m w-full">{product?.name}</h1>
    <p class="text-heading-h3 pr-2xl">{price}</p>
  </header>

  <section class="product-layout__body flex flex-col md:items-start">
    {#if (product?.variants?.length ?? 0) > 1}
      <div class="pb-[20px] space-y-xl">
        {#if product?.filters?.colors?.length > 1}
          <div>
            <h2 class="text-x-large font-normal pb-m">
              Color: <strong class="font-semibold">{variant.details.color}</strong>
            </h2>
            <ColorPicker
              activeColor={variant.details.color}
              colors={product?.filters?.colors}
              {colorVariants}
              shouldClickReplaceState={true}
              on:mouseenter={handleColorHover}
              on:mouseleave={handleColorHover}
            />
          </div>
        {/if}

        {#if sizeVariants?.length > 1}
          <div>
            <h2 class="text-x-large font-normal pb-m">
              Size: <strong class="font-semibold">{variant.details.size}</strong>
            </h2>
            <SizePicker
              activeSize={variant.details.size}
              {sizeVariants}
              shouldClickReplaceState={true}
            />
          </div>
        {/if}
      </div>
    {/if}

    <QuantitySelector
      ref="product-quantity-selector"
      quantity={purchaseQuantity}
      on:increment={() => (purchaseQuantity += 1)}
      on:decrement={() => (purchaseQuantity > 1 ? (purchaseQuantity -= 1) : 0)}
    />

    <Button
      size="large"
      onClick={() => addToCart({ variant, product, quantity: purchaseQuantity })}
    >
      Add to cart
    </Button>

    <p class="whitespace-pre-wrap pt-xl">
      {product?.description}
    </p>
  </section>

  {#if sizeTables.length > 0}
    <section
      class="product-layout__sizing border-t border-divider-subtle/40 pt-xl mt-2xl grid grid-cols-[repeat(auto-fit,_minmax(290px,_1fr))] gap-3xl"
    >
      {#each sizeTables as sizeTable, i}
        <div class="pt-2xl" class:order-last={i === 0}>
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

    :global([data-ref='product-layout__breadcrumbs']) {
      grid-area: breadcrumbs;
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

    :global([data-ref='product-quantity-selector']) {
      margin-bottom: 16px;
    }
  }
</style>
