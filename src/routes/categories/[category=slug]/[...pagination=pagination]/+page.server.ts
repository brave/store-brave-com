import { error, redirect } from '@sveltejs/kit';
import { sdk } from '$lib/graphql/sdk';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function load({ params, url }) {
  const pagination = params.pagination.match(/^page\/(?<pageNum>\d+)/);

  const basePath = url.pathname.split("page/")[0];

  if (params.pagination === 'page/' && !pagination) {
    throw redirect(307, basePath);
  } else if (params.pagination && !pagination) {
    throw error(404);
  }

  const limit = 9;
  const page = parseInt((pagination && pagination?.groups?.pageNum) ?? '') || 1;
  
  if (pagination && page === 1) {
    throw redirect(307, basePath);
  }

  const pageIndex = page ? page - 1 : 0;
  const offset = pageIndex * limit;
  let results;
  if (params.category === 'all') {
    results = await sdk.Products({ limit, offset });
    results = {
      ...results,
      name: 'All products',
      slug: 'all'
    };
  } else {
    const { category: categoryResults } = await sdk.ProductsByCategory({
      categorySlug: params.category,
      limit,
      offset
    });
    results = categoryResults;
  }
  const { products, productsCount, ...category } = results || {};

  if (!products || (products && products?.length <= 0)) {
    throw error(404, 'No products found.');
  }

  return {
    title: category.name ?? "",
    category,
    products,
    productsCount,
    pageLimit: limit,
    currentPage: page
  };
};
