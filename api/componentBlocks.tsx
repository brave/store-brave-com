/** @jsx */
import { component, fields, NotEditable } from '@keystone-6/fields-document/component-blocks';

export const componentBlocks = {
  featured: component({
    label: 'Featured Product',
    preview: function Preview({
      fields: {
        product: { value }
      }
    }) {
      if (!value) return null;
      const { data: product } = value;
      return (
        <NotEditable>
          <div
            style={{
              overflowY: 'scroll',
              display: 'grid',
              gridAutoFlow: 'column',
              scrollSnapType: 'y mandatory'
            }}
          >
            <img
              width={100}
              src={product.firstVariant?.details.files.at(-1).thumbnail_url}
              alt={`Thumbnail for ${product.name}`}
            />
            <h2>{product.name}</h2>
          </div>
        </NotEditable>
      );
    },
    schema: {
      product: fields.relationship({
        label: 'Products',
        listKey: 'Product',
        selection: `id name firstVariant { details }`
      })
    }
  })
};
