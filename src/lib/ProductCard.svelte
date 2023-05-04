<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { ProductSummaryFragment } from './graphql/index.generated';
  import { formatPrice } from './utils';
  import ColorPicker from './ColorPicker.svelte';
  import { goto } from '$app/navigation';

  export let product: ProductSummaryFragment;
  $: colorVariants =
    product?.variants?.filter((v) => v.details.size === product.firstVariant?.details.size) || [];

  let priceRange = product.priceRange
    ?.map((p) => {
      return p && formatPrice(p);
    })
    .join(' - ');

  const defaultImage = product.firstVariant?.details.files.at(-1).preview_url;
  let currentImage = defaultImage;
  const handleColorHover = (e: CustomEvent) => {
    if (e.type === 'mouseleave') {
      currentImage = defaultImage;
    } else if (e.type === 'mouseenter') {
      currentImage = e.detail.colorVariant?.details.files.at(-1).preview_url;
    }
  }
</script>

<article class="shadow-02 border border-divider-subtle rounded-8 p-4 bg-container-background">
  <a href={`${product.firstVariant?.permalink}/`}>
    <img
      in:fade={{ duration: 200 }}
      src={currentImage}
      alt="Thumbnail for {product.name}"
      class="js-loading aspect-square w-full"
    />
  </a>
  <div class="flex flex-col pt-4">
    {#if product?.filters?.colors?.length > 1}
      <div class="pb-2 mx-auto">
        <ColorPicker
          size="small"
          colors={product?.filters?.colors}
          {colorVariants}
          on:click={(e) => goto(e.detail.colorVariant.permalink)}
          on:mouseenter={handleColorHover}
          on:mouseleave={handleColorHover}
        />
      </div>
    {/if}
    <a href={`${product.firstVariant?.permalink}/`}>
      <h1 class="text-h3 max-xs:text-center">
        {product.name}
      </h1>
      <p class="whitespace-nowrap shrink-0 leading-7">{priceRange}</p>
    </a>
  </div>
</article>
