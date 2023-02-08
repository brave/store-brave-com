<script>
  import Breadcrumbs from '$lib/Breadcrumbs.svelte';
  import Pagination from '$lib/Pagination.svelte';
  import ProductList from '$lib/ProductList.svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  $: products = data.products || [];
  $: productsCount = data.productsCount || 0;
  $: currentPage = data.currentPage;
  $: pageLimit = data.pageLimit;
  $: category = data.category;

  /** @type {Array<{ label: string, link?: string }>} */
  let breadcrumbs;
  $: {
    breadcrumbs = [{ label: "All products", link: "/categories/all/" }]
    if (category?.name && category?.slug !== "all") {
      breadcrumbs = [...breadcrumbs, {
        label: category.name
      }];
    }
  }
</script>

{#if breadcrumbs.length > 1}
  <Breadcrumbs crumbs={breadcrumbs} />
{/if}

<h1 class="text-display-display1 pb-6">{category?.name}</h1>

<ProductList {products} />

<Pagination itemCount={productsCount} perPageLimit={pageLimit} {currentPage} />
