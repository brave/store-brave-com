import { sdk } from '$lib/graphql/sdk';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const { products } = await sdk.FeaturedProducts();

  return {
    title: 'Home',
    featuredProducts: products
  };
}
