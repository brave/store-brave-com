<script lang="ts">
  import type { ProductSummaryFragment } from './graphql/index.generated';
  import ProductCard from './ProductCard.svelte';

  export let products: Array<ProductSummaryFragment> = [];
</script>

<section
  class="grid xs:grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] grid-flow-row gap-[20px] items-stretch"
>
  {#each products as product (product.id)}
    <ProductCard {product} />
  {/each}
</section>
