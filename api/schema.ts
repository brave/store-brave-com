import { list, graphql } from '@keystone-6/core';
import slugify from 'slugify';

import { allowAll } from '@keystone-6/core/access';
import { text, relationship, password, json, virtual, checkbox, timestamp } from '@keystone-6/core/fields';

import { Lists, Context } from '.keystone/types';
import { findAndDownloadImages } from './utils';

export const lists: Lists = {
  // Here we define the user list.
  User: list({
    access: allowAll,
    // Here are the fields that `User` will have. We want an email and password so they can log in
    // a name so we can refer to them, and a way to connect users to posts.
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true
      }),
      // The password field takes care of hiding details and hashing values
      password: password({ validation: { isRequired: true } })
    },
    // Here we can configure the Admin UI. We want to show a user's name and posts in the Admin UI
    ui: {
      listView: {
        initialColumns: ['name']
      }
    }
  }),

  Product: list({
    access: allowAll,
    fields: {
      name: text(),
      isFeatured: checkbox(),
      slug: text({
        isIndexed: 'unique',
        isFilterable: true,
        ui: {
          itemView: { fieldMode: 'read', fieldPosition: 'sidebar' },
          listView: { fieldMode: 'read' },
          createView: { fieldMode: 'hidden' }
        },
        hooks: {
          resolveInput({ operation, inputData }) {
            const { slug, name } = inputData;
            if (operation === 'create' && !slug && name) {
              return slugify(name, { lower: true, strict: true });
            }
          }
        }
      }),
      description: text({
        ui: {
          displayMode: 'textarea',
          listView: { fieldMode: 'hidden' }
        }
      }),
      filters: json({
        ui: {
          itemView: { fieldMode: 'hidden' },
          listView: { fieldMode: 'hidden' },
          createView: { fieldMode: 'hidden' }
        }
      }),
      thumbnail: text(),
      sizingCharts: json({
        ui: {
          itemView: { fieldMode: 'hidden' },
          listView: { fieldMode: 'hidden' },
          createView: { fieldMode: 'hidden' }
        }
      }),
      printfulProductId: text({
        isIndexed: 'unique',
        validation: {
          isRequired: true
        },
        ui: {
          itemView: { fieldMode: 'read', fieldPosition: 'sidebar' },
          listView: { fieldMode: 'read' }
        }
      }),
      category: relationship({
        ref: 'Category.products',
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] }
        }
      }),
      priceRange: virtual({
        ui: {
          itemView: { fieldMode: 'hidden' },
          listView: { fieldMode: 'hidden' }
        },
        field: (lists) => graphql.field({
          type: graphql.list(graphql.Float),
          async resolve(item, args, _context) {
            const context = _context as Context;
            const { variants } = await context.query.Product.findOne({
              where: { id: item.id.toString() },
              query: `variants { details }`
            });

            const variantPrices = variants.map((v: Lists.Variant.Item) => {
              const details = v.details as any;
              return parseFloat(details.price);
            });

            const range = new Set([Math.min(...variantPrices), Math.max(...variantPrices)]);

            return Array.from(range);
          }
        })
      }),
      firstVariant: virtual({
        ui: {
          itemView: { fieldMode: 'hidden' },
          listView: { fieldMode: 'hidden' }
        },
        field: (lists) =>
          graphql.field({
            type: lists.Variant.types.output,
            async resolve(item, args, _context) {
              const context = _context as Context;
              const { variants } = await context.query.Product.findOne({
                where: { id: item.id.toString() },
                query: `variants(take: 1, orderBy: { printfulVariantId: asc }) { id }`
              });
              if (variants.length > 0) {
                return context.db.Variant.findOne({ where: { id: variants[0].id } });
              }
            }
          })
      }),
      variants: relationship({
        ref: 'Variant.product',
        many: true,
        ui: {
          hideCreate: true,
          removeMode: 'none',
          itemView: { fieldMode: 'read', fieldPosition: 'sidebar' },
          listView: { fieldMode: 'read' }
        }
      })
    },
    hooks: {
      resolveInput: async ({ resolvedData }) => {
        return await findAndDownloadImages(resolvedData);
      },
      beforeOperation: async ({ item, operation, context }) => {
        if (operation === 'delete') {
          const variants = await context.query.Variant.findMany({
            where: { product: { id: { equals: item.id } } }
          });
          await context.query.Variant.deleteMany({
            where: variants.map(v => ({ id: v.id }))
          });
        }
      }
    }
  }),

  Variant: list({
    access: allowAll,
    fields: {
      permalink: virtual({
        field: graphql.field({
          type: graphql.String,
          async resolve(item, args, _context) {
            const context = _context as Context;
            const { product } = await context.query.Variant.findOne({
              where: { id: item.id.toString() },
              query: `product { slug }`
            });
            return `/p/${product.slug}/${item.printfulVariantId}/`;
          }
        })
      }),
      printfulVariantId: text({
        isIndexed: 'unique',
        validation: {
          isRequired: true
        }
      }),
      details: json(),
      product: relationship({ ref: 'Product.variants' })
    },
    hooks: {
      resolveInput: async ({ resolvedData }) => {
        return await findAndDownloadImages(resolvedData);
      }
    },
    ui: {
      isHidden: true
    }
  }),

  Category: list({
    access: allowAll,
    fields: {
      name: text(),
      slug: text({
        isIndexed: 'unique',
        isFilterable: true,
        ui: {
          itemView: { fieldMode: 'read' },
          listView: { fieldMode: 'read' },
          createView: { fieldMode: 'hidden' }
        },
        hooks: {
          resolveInput({ inputData }) {
            const { slug, name } = inputData as any;
            if (!slug && name) {
              return slugify(name, { lower: true, strict: true });
            }
          }
        }
      }),
      products: relationship({ ref: 'Product.category', many: true })
    },
    ui: {
      isHidden: true
    }
  }),

  ProcessedOrder: list({
    access: allowAll,
    fields: {
      idempotency_key: text({
        isIndexed: 'unique',
        isFilterable: true,
        validation: { isRequired: true },
        ui: {
          itemView: { fieldMode: 'read' },
          listView: { fieldMode: 'read' },
          createView: { fieldMode: 'hidden' }
        }
      })
    },
    ui: {
      isHidden: true
    }
  }),

  ShippingDataKey: list({
    access: allowAll,
    fields: {
      key: text({
        validation: { isRequired: true },
        ui: {
          itemView: { fieldMode: 'read' },
          listView: { fieldMode: 'read' },
          createView: { fieldMode: 'hidden' }
        }
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
        isIndexed: true,
        validation: { isRequired: true },
        ui: {
          itemView: { fieldMode: 'read' },
          listView: { fieldMode: 'read' },
          createView: { fieldMode: 'hidden' }
        }
      })
    },
    ui: {
      isHidden: true
    }
  })
};
