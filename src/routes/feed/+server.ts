import { BASE_URL } from '$app/env/private';
import { sdk } from '$lib/graphql/sdk';
import { formatPrice } from '$lib/utils';
import type { RequestHandler } from './$types';

export const GET = (async () => {
  const allProducts = (await sdk.Products({ limit: 100 }))?.products;

  return new Response(
    `<rss xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/" version="2.0">
  <channel>
    <title>Brave Merch Store</title>
    <link>${BASE_URL}</link>
    <description>Community inspired, professionally designed.</description>
    <language>en-us</language>
    <atom:link href="${BASE_URL}/feed" rel="self" type="application/rss+xml"/>
    ${allProducts?.map((product) => {
      let priceRange = product.priceRange
        ?.map((p) => {
          return p && formatPrice(p);
        })
        .join(' - ');
      return `<item>
        <title>${product.name}</title>
        <link>${BASE_URL}${product.firstVariant?.permalink}</link>
        <guid>${BASE_URL}${product.firstVariant?.permalink}</guid>
        <description>${priceRange}</description>
        ${product.category ? `<category>${product.category?.name}</category>` : ''}
        <media:content url="${product.firstVariant?.details.files.at(-1).preview_url}"/>
      </item>`;
    }).join(`
      `)}
  </channel>
</rss>`,
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  );
}) satisfies RequestHandler;
