<script lang="ts">
  import type { ProductSummaryFragment } from './graphql/index.generated';
  import { formatPrice, isInViewport } from './utils';
  import ColorPicker from './ColorPicker.svelte';
  import { afterNavigate, onNavigate } from '$app/navigation';
  import { viewTransition } from '../routes/+layout.svelte';

  export let product: ProductSummaryFragment;
  $: colorVariants =
    product?.variants?.filter((v) => v.details.size === product.firstVariant?.details.size) || [];

  let priceRange = product.priceRange
    ?.map((p) => {
      return p && formatPrice(p);
    })
    .join(' - ');

  /**
   * Rather than preload all color variant images for the entire list
   * of products on a page, the shouldPreloadImages variable is used
   * as a switch which is enabled on mouseenter for a ProductCard to
   * only preload images associated with that specific card.
   */
  let shouldPreloadImages = false;
  const defaultImage = product.firstVariant?.details.files.at(-1).preview_url;
  let currentImage = defaultImage;
  const handleColorHover = (e: CustomEvent) => {
    if (e.type === 'mouseleave') {
      currentImage = defaultImage;
    } else if (e.type === 'mouseenter') {
      currentImage = e.detail.colorVariant?.details.files.at(-1).preview_url;
    }
  };

  let productImage: HTMLImageElement;
  afterNavigate((navigation) => {
    // @ts-ignore
    if (isInViewport(productImage) && product.slug === navigation.from?.params?.product) {
      // @ts-ignore
      productImage.style.viewTransitionName = 'product-image';
      // @ts-ignore
      $viewTransition?.finished.finally(() => {
        // @ts-ignore
        productImage && (productImage.style.viewTransitionName = '');
      });
    }
  })

  onNavigate((navigation) => { 
    if (product.slug === navigation.to?.params?.product) {
      // @ts-ignore
      productImage.style.viewTransitionName = 'product-image';
      // @ts-ignore
      $viewTransition?.finished.finally(() => {
        // @ts-ignore
        productImage && (productImage.style.viewTransitionName = '');
      });
    }
  });
</script>

<article
  class="shadow-02 border border-divider-subtle/40 rounded-m p-xl bg-container-background"
  on:mouseenter={() => (shouldPreloadImages = true)}
>
  <a href={`${product.firstVariant?.permalink}`}>
    <img
      src={currentImage}
      alt="Thumbnail for {product.name}"
      class="js-loading aspect-square w-full"
      bind:this={productImage}
    />
    <div class="flex flex-col pt-s">
      <h2 class="text-heading-h4 max-xs:text-center">
        {product.name}
      </h2>
      <p class="whitespace-nowrap shrink-0 leading-7 max-xs:text-center">{priceRange}</p>
    </div>
  </a>
  {#if product?.filters?.colors?.length > 1}
    <div class="pt-s mx-auto">
      <ColorPicker
        size="small"
        colors={product?.filters?.colors}
        {colorVariants}
        {shouldPreloadImages}
        on:mouseenter={handleColorHover}
        on:mouseleave={handleColorHover}
      />
    </div>
  {/if}
</article>
