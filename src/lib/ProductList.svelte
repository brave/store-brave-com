<script lang="ts">
  import type { ProductSummaryFragment } from "./graphql/index.generated";
  import ProductCard from "./ProductCard.svelte";

  export let products: Array<ProductSummaryFragment> = [];
</script>

<section class="grid xs:grid-cols-[repeat(auto-fit,_minmax(350px,_450px))] grid-flow-row gap-5 items-start">
  {#each products as product (product.id)}
    <ProductCard {product} />
  {/each}
</section>