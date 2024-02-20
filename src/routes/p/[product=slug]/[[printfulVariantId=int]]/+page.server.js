import { sdk } from '$lib/graphql/sdk';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  /** @type {{ productSlug: string, printfulId?: string }} */
  const filter = {
    productSlug: params.product
  };

  /**
   * Only query printfulVariantId if provided in URL,
   * otherwise, redirect to first variant URL.
   */
  if (params.printfulVariantId) {
    filter.printfulId = params.printfulVariantId;
  }
  const { variants } = await sdk.Variant(filter);

  /**
   * Page should return 404 if no variants are found,
   * but if there are more than one variants found (e.g.
   * a variant ID was not provided in the URL), then it
   * should redirect to the first variant.
   */
  if (!variants || variants.length < 1) {
    error(404, 'Product not found.');
  } else if (variants.length > 1) {
    redirect(303, variants[0]?.permalink ?? '');
  }

  const { product, ...variant } = variants[0];

  return {
    title: product?.name ?? "",
    product,
    variant
  };
}
