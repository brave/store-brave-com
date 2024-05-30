<script lang="ts">
  import type { PageData } from './$types';
  import Button from '@brave/leo/src/components/button/button.svelte';
  import ProductList from '$lib/ProductList.svelte';

  export let data: PageData;
  $: ({ featuredProducts, categories } = data);
</script>

<section class="hero flex flex-col pt-[3vh]">
  <p class="title text-[4rem] leading-none font-semibold pb-l">Be Brave</p>
  <h1 class="subtitle text-[22px] font-medium pb-l">The Brave Merch Store</h1>
  <p class="description font-medium">Community inspired, professionally designed.</p>

  <div class="flex flex-wrap gap-m pt-5xl">
    {#each categories ?? [] as category}
      {#if category.productsCount}
        <Button size="large" href="/categories/{category.slug}/">{category.name}</Button>
      {/if}
    {/each}
    <Button size="large" href="/categories/all/">All products</Button>
  </div>
</section>

{#if featuredProducts?.length}
  <h2 class="pt-5xl text-[22px] leading-none pb-xl font-medium">Featured items</h2>
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
