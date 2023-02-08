import { sdk } from '$lib/graphql/sdk';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const { categories } = await sdk.Categories();
  const { products } = await sdk.FeaturedProducts();

  return {
    title: "Home",
    categories,
    featuredProducts: products
  };
}
