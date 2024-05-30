import { sdk } from '$lib/graphql/sdk';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  const { categories } = await sdk.Categories();

  return {
    categories,
  };
}
