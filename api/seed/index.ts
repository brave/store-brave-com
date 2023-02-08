import { KeystoneContext } from '@keystone-6/core/types';
import products from './products';
import variants from './variants';

export async function seedDB(context: KeystoneContext) {
  await context.db.Product.createMany({
    data: products
  });

  await context.db.Variant.createMany({
    data: variants
  });
}
