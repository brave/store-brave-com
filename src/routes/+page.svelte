<script lang="ts">
  import type { PageData } from './$types';
  import Button from '@brave/leo/web-components/button/button.svelte';
  import ProductList from '$lib/ProductList.svelte';

  export let data: PageData;
  $: ({ featuredProducts, categories } = data);
</script>

<section class="hero flex flex-col pt-[3vh]">
  <h1 class="text-[4rem] leading-none font-semibold pb-3">Be Brave</h1>
  <h1 class="text-[22px] font-medium pb-3">The Brave Merch Store</h1>
  <p class="text-large font-medium">Community inspired, professionally designed.</p>

  <div class="flex flex-wrap gap-2 pt-12">
    {#each categories ?? [] as category}
      {#if category.productsCount}
        <Button size="large" href="/categories/{category.slug}/">{category.name}</Button>
      {/if}
    {/each}
    <Button size="large" href="/categories/all/">All products</Button>
  </div>
</section>

{#if featuredProducts?.length}
  <h2 class="pt-12 text-[22px] leading-none pb-4 font-medium">Featured items</h2>
  <ProductList products={featuredProducts} />
{/if}