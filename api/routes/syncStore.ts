/**
 * Currently sync does the following:
 * 1. Fetches all products/variants in Brave store
 * 2. Fetches all products/variants from Printful
 *    NOTE: the API occassionally returns a 404 or fetch failed
 * 3. Delete any products no longer in Printful or marked as ignored
 * 4. Loops through all Printful products
 * 5. Runs an upsert function on each Printful product. Criteria:
 *    - existingProductData.name !== newProductData.name
 *    - !existingProductData.description
 *    - !existingProductData.thumbnail
 *    - newProductData.filters && JSON.stringify(existingProductData.filters) !== JSON.stringify(newProductData.filters)
 *    - newProductData.variants contains ids not in existingProductData.variants
 * 6. Delete any variants no longer in Printful
 */

import type { Request, Response } from 'express';
import type { Context } from '.keystone/types';
import { printfulApi, upsertProduct } from '../utils';

// @ts-ignore
import { transformProduct } from '../utils/transformProduct';

export async function syncStore(req: Request, res: Response) {
  const { context } = req as typeof req & { context: Context };

  try {
    const products = (await context.query.Product.findMany({
      query: 'name printfulProductId description thumbnail filters sizingCharts variants { printfulVariantId }'
    })) ?? [];
    const existingProductIds: Array<any> = [];
    const existingProducts: Map<string, any> = new Map();
    products.map((product) => product.printfulProductId);
    for (let product of products) {
      existingProductIds.push(product.printfulProductId);
      existingProducts.set(product.printfulProductId, product);
    }

    // Get all products from the store
    const allProducts = (await getProductsAndVariants({ existingProductIds })).filter(
      (p) => p !== null
    );

    /**
     * Remove any products which no longer exist in Printful store,
     * or have been marked as "ignored"
     * 
     * TODO: ensure that products aren't accidentally removed due to
     * failed API responses returning null
     */
    const staleProductIds = allProducts
      .filter((p) => {
        return existingProductIds.includes(p.printfulProductId) && p.isIgnored;
      })
      .map((p) => ({ printfulProductId: p.printfulProductId }))
      .concat(
        existingProductIds
          .filter((pId) => !allProducts.some((i) => i.printfulProductId === pId))
          .map((pId) => ({ printfulProductId: pId }))
      );
    await context.query.Product.deleteMany({
      where: staleProductIds
    });

    // Filter products to only include those not ignored
    const remainingProducts = allProducts
      .filter((p) => !p.isIgnored)
      .map((p) => {
        const { isIgnored, ...rest } = p;
        return rest;
      });

    // Upsert products
    await Promise.all(
      remainingProducts.map((newProductData) => {
        const existingProduct = existingProducts.get(newProductData.printfulProductId);
        return upsertProduct(newProductData, existingProduct, context);
      })
    );

    /**
     * Determine which variants were synced in order to delete
     * any stale variants.
     */
    const syncedVariantIds: Array<string> = [];
    allProducts
      .filter((p: any) => !p.isIgnored)
      .forEach((p: any) => {
        p.variants.forEach((v: any) => syncedVariantIds.push(v.printfulVariantId));
      });

    const deletedVariants = await context.query.Variant.findMany({
      where: { printfulVariantId: { notIn: syncedVariantIds } },
      query: 'printfulVariantId'
    });

    if (deletedVariants.length) {
      await context.query.Variant.deleteMany({
        where: deletedVariants.map((v) => ({ printfulVariantId: v.printfulVariantId }))
      });
    }

    res.json({ complete: true });
  } catch (e: any) {
    console.log(e);
    res.json({ message: e.message });
  }
}

interface ExistingIds {
  existingProductIds?: Array<string>;
}
async function getProductsAndVariants({ existingProductIds }: ExistingIds) {
  const response = await printfulApi('/store/products?limit=100');

  console.log("Total products and variants count:",
    response.reduce((sum: number, p: any) => {
      return !p.is_ignored ? sum + p.variants : sum;
    }, 0)
  );

  return Promise.all(
    response
      .filter((p: any) => p.thumbnail_url)
      .map(async ({ id }: any) => {
        try {
          const { product, variants } = await transformProduct(id, {
            existingProductIds
          });

          return {
            ...product,
            variants
          };
        } catch (e: any) {
          console.log(e.message);
          return null;
        }
      })
  );
}
