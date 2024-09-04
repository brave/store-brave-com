import { sdk } from '$lib/graphql/sdk';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ route }) {
  if (route.id === '/[slug=slug]') return;

  const { categories } = await sdk.Categories();

  return {
    categories
  };
}
