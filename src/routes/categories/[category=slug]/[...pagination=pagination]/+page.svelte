<script>
  import Breadcrumbs from '$lib/Breadcrumbs.svelte';
  import Pagination from '$lib/Pagination.svelte';
  import ProductList from '$lib/ProductList.svelte';
  import Button from '@brave/leo/src/components/button/button.svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  $: products = data.products || [];
  $: productsCount = data.productsCount || 0;
  $: currentPage = data.currentPage;
  $: pageLimit = data.pageLimit;
  $: categories = data.categories;
  $: category = data.category;

  /** @type {Array<{ label: string, link?: string }>} */
  let breadcrumbs;
  $: {
    breadcrumbs = [{ label: 'All products', link: '/categories/all/' }];
    if (category?.name && category?.slug !== 'all') {
      breadcrumbs = [
        ...breadcrumbs,
        {
          label: category.name
        }
      ];
    }
  }
</script>

{#if breadcrumbs.length > 1}
  <Breadcrumbs crumbs={breadcrumbs} />
{/if}

<h1 class="text-heading-h1 pb-2xl [view-transition-name:page-name]">{category?.name}</h1>

<div class="flex flex-wrap gap-m pb-4xl [view-transition-name:category-nav]">
  {#each [{ name: 'All products', slug: 'all', productsCount: 1 }, ...(categories ?? [])] as c}
    {@const cPermalink = `/categories/${c.slug}/`}
    {#if c.productsCount}
      <Button size="tiny" kind={c.slug === category?.slug ? 'filled' : 'outline'} href={cPermalink}>
        {c.name}
      </Button>
    {/if}
  {/each}
</div>

<ProductList {products} />

<Pagination itemCount={productsCount} perPageLimit={pageLimit} {currentPage} />
