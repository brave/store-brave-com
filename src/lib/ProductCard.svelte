<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { ProductSummaryFragment } from './graphql/index.generated';
  import { formatPrice } from './utils';

  export let product: ProductSummaryFragment;

  let priceRange = product.priceRange
    ?.map((p) => {
      return p && formatPrice(p);
    })
    .join(' - ');
</script>

<article class="shadow-02 border border-divider-subtle rounded-8 p-4 bg-container-background">
  <a href={`${product.firstVariant?.permalink}/`}>
    <img
      in:fade={{ duration: 200 }}
      src={product.firstVariant?.details.files.at(-1).preview_url}
      alt="Thumbnail for {product.name}"
      class="js-loading aspect-square w-full"
    />
    <div class="flex justify-between pt-4 max-xs:flex-col gap-2 xs:gap-8">
      <h1 class="text-h3 max-xs:text-center">
        {product.name}
      </h1>
      <p class="text-center whitespace-nowrap shrink-0 leading-7">{priceRange}</p>
    </div>
  </a>
</article>
