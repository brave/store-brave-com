<script lang="ts">
  import type { PageData } from './$types';
  import Button from '@brave/leo/web-components/button/button.svelte';
  import ProductList from '$lib/ProductList.svelte';

  export let data: PageData;
  $: ({ featuredProducts, categories } = data);
</script>

<section class="hero flex flex-col pt-[3vh]">
  <h1 class="title text-[4rem] leading-none font-semibold pb-3">Be Brave</h1>
  <h1 class="subtitle text-[22px] font-medium pb-3">The Brave Merch Store</h1>
  <p class="description font-medium">Community inspired, professionally designed.</p>

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

<style lang="scss">
  .title {
    font-size: clamp(2.8rem, 1.0667rem + 10.6667vw, 4rem);
  }

  .subtitle {
    font-size: clamp(1rem, 0.4583rem + 3.3333vw, 1.375rem);
  }

  .description {
    font-size: clamp(0.875rem, 0.6944rem + 1.1111vw, 1rem);
  }
</style>