import { printfulApi } from './index';

const errors = {
  NOT_FOUND: 'Not Found',
  EXCEEDED_LIMIT: "You've recently sent too many requests. Please try again after 60 seconds."
};

/**
 * Transform Printful Sync Product for insertion to database
 * https://developers.printful.com/docs/#operation/getSyncProductById
 *
 * Note: Printful has two concepts for products/variants:
 * 1. Products – the root product on which the branding is placed.
 *    E.g. a blue Gilden t-shirt
 * 2. Sync Products/Variants – products which have the actual branding.
 *    E.g. a blue Gilden t-shirt with an embroidered Brave logo on the
 *    front, outside, left.
 * This function fetches details about each individual Sync Variant,
 * while also getting information about the Product, like description
 * and sizing charts.
 *
 * @param {number} productId
 * @param {{ existingProductIds: Array<string> }} options
 * @return {Promise<{ product: Product, variants: Array<Variant> }>}
 */
export async function transformProduct(productId, options) {
  const { sync_variants, sync_product } = await printfulApi(`/store/products/${productId}`);
  const { allColors, allSizes, variants, productDetails } =
    await getAllVariantDetailsAndExtractProductDetails(sync_variants);

  const sizingCharts = !options.existingProductIds.includes(productId) && await printfulApi(`/products/${productDetails.id}/sizes`);

  /** @type {Product} */
  const product = {
    printfulProductId: String(productId),
    name: sync_product.name,
    description: productDetails.description,
    thumbnail: sync_product.thumbnail_url,
    isIgnored: sync_product.is_ignored
  };
  if (sizingCharts) {
    product.sizingCharts = sizingCharts;
  }
  if (allColors.length || allSizes.length) {
    /** @type {{ colors?: Array<string>, sizes?: Array<string> }} */
    const filters = {};
    if (allColors.length) {
      filters.colors = Array.from(allColors);
    }
    if (allSizes.length) {
      filters.sizes = Array.from(allSizes);
    }

    product.filters = filters;
  }

  /**
   * @typedef {Object} VariantAndProductDetails
   * @property {Array<object>} allColors
   * @property {Array<string>} allSizes
   * @property {Array<Variant|null>} variants
   * @property {{ id: number, description: string }|undefined} productDetails
   *
   * @param {Array<any>} variants
   * @returns {Promise<VariantAndProductDetails>}
   */
  async function getAllVariantDetailsAndExtractProductDetails(variants) {
    const allColorNames = new Set();
    const allPrimaryColorCodes = new Set();
    const allSecondaryColorCodes = new Set();
    const allSizes = new Set();

    /** @type {{ id: number, description: string }|undefined} */
    let productDetails;
    const variantsWithDetails = await Promise.all(
      variants.map(async (variant) => {
        try {
          const { id, name, retail_price, sku, currency, files, variant_id } = variant;
          const response = await printfulApi(`/products/variant/${variant.variant_id}`);

          // Handle discontinued variants
          if (Object.values(errors).includes(response)) {
            throw new Error(response);
          }

          const {
            product,
            variant: { color, color_code, color_code2, size }
          } = response;

          if (color) {
            allColorNames.add(color);
          }
          if (color_code) {
            allPrimaryColorCodes.add(color_code);
          }
          if (color_code2) {
            allSecondaryColorCodes.add(color_code2);
          }
          if (size) {
            allSizes.add(size);
          }

          if (!productDetails) {
            productDetails = product;
          }

          return {
            printfulVariantId: String(id),
            details: {
              name,
              price: retail_price,
              sku,
              currency,
              files,
              color,
              size,
              baseVariantId: variant_id
            }
          };
        } catch (e) {
          console.log(`Product: /store/products/${productId}`)
          console.log(`Variant: /products/variant/${variant.variant_id}`);
          console.log(e.message);

          if (e.message === errors.NOT_FOUND) {
            return null;
          } else {
            return null;
            // TODO: should keep track of failed attempts in a queue and try again
          }
        }
      })
    );

    return {
      allColors: transformColors(allColorNames, allPrimaryColorCodes, allSecondaryColorCodes),
      allSizes: Array.from(allSizes),
      variants: variantsWithDetails.filter((v) => v !== null),
      productDetails
    };
  }

  /**
   * @param {Set<string>} allColors
   * @param {Set<string>} allPrimaryColorCodes
   * @param {Set<string>} allSecondaryColorCodes
   * @return {Array<object>}
   */
  function transformColors(allColors, allPrimaryColorCodes, allSecondaryColorCodes) {
    const colors = [];
    for (let i = 0; i < allColors.size; i++) {
      colors.push({
        name: Array.from(allColors)[i],
        primary: Array.from(allPrimaryColorCodes)[i],
        secondary: Array.from(allSecondaryColorCodes)[i]
      });
    }
    return colors;
  }

  return {
    product,
    variants
  };
}
