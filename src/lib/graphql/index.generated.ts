/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type FeaturedProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type FeaturedProductsQuery = { products: Array<{ id: string, name: string | null, slug: string | null, priceRange: Array<number | null> | null, filters: unknown, firstVariant: { permalink: string | null, details: unknown } | null, variants: Array<{ id: string, permalink: string | null, printfulVariantId: string | null, details: unknown }> | null, category: { name: string | null, slug: string | null } | null }> | null };

export type ProductsQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
}>;


export type ProductsQuery = { productsCount: number | null, products: Array<{ id: string, name: string | null, slug: string | null, priceRange: Array<number | null> | null, filters: unknown, firstVariant: { permalink: string | null, details: unknown } | null, variants: Array<{ id: string, permalink: string | null, printfulVariantId: string | null, details: unknown }> | null, category: { name: string | null, slug: string | null } | null }> | null };

export type ProductsByCategoryQueryVariables = Exact<{
  categorySlug?: string | null | undefined;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
}>;


export type ProductsByCategoryQuery = { category: { name: string | null, slug: string | null, productsCount: number | null, products: Array<{ id: string, name: string | null, slug: string | null, priceRange: Array<number | null> | null, filters: unknown, firstVariant: { permalink: string | null, details: unknown } | null, variants: Array<{ id: string, permalink: string | null, printfulVariantId: string | null, details: unknown }> | null, category: { name: string | null, slug: string | null } | null }> | null } | null };

export type VariantQueryVariables = Exact<{
  printfulId?: string | null | undefined;
  productSlug?: string | null | undefined;
}>;


export type VariantQuery = { variants: Array<{ id: string, permalink: string | null, printfulVariantId: string | null, details: unknown, product: { name: string | null, slug: string | null, description: string | null, thumbnail: string | null, filters: unknown, sizingCharts: unknown, variants: Array<{ id: string, permalink: string | null, printfulVariantId: string | null, details: unknown }> | null, category: { name: string | null, slug: string | null } | null } | null }> | null };

export type VariantsQueryVariables = Exact<{
  variantIds?: Array<string | number> | string | number | null | undefined;
}>;


export type VariantsQuery = { variants: Array<{ id: string, permalink: string | null, printfulVariantId: string | null, details: unknown }> | null };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { categories: Array<{ id: string, name: string | null, slug: string | null, productsCount: number | null }> | null };

export type ShippingDataKeyQueryVariables = Exact<{
  id?: string | number | null | undefined;
}>;


export type ShippingDataKeyQuery = { shippingDataKey: { key: string | null } | null };

export type AddProcessedOrderMutationVariables = Exact<{
  idempotencyKey?: string | null | undefined;
}>;


export type AddProcessedOrderMutation = { createProcessedOrder: { id: string } | null };

export type AddShippingDataKeyMutationVariables = Exact<{
  key?: string | null | undefined;
}>;


export type AddShippingDataKeyMutation = { createShippingDataKey: { id: string } | null };

export type DeleteShippingDataKeyMutationVariables = Exact<{
  id?: string | number | null | undefined;
}>;


export type DeleteShippingDataKeyMutation = { deleteShippingDataKey: { id: string } | null };

export type ProductSummaryFragment = { id: string, name: string | null, slug: string | null, priceRange: Array<number | null> | null, filters: unknown, firstVariant: { permalink: string | null, details: unknown } | null, variants: Array<{ id: string, permalink: string | null, printfulVariantId: string | null, details: unknown }> | null, category: { name: string | null, slug: string | null } | null };

export type ProductDetailsFragment = { name: string | null, slug: string | null, description: string | null, thumbnail: string | null, filters: unknown, sizingCharts: unknown, category: { name: string | null, slug: string | null } | null };

export type VariantDetailsFragment = { id: string, permalink: string | null, printfulVariantId: string | null, details: unknown };

export const VariantDetailsFragmentDoc = gql`
    fragment VariantDetails on Variant {
  id
  permalink
  printfulVariantId
  details
}
    `;
export const ProductSummaryFragmentDoc = gql`
    fragment ProductSummary on Product {
  id
  name
  slug
  priceRange
  firstVariant {
    permalink
    details
  }
  filters
  variants {
    ...VariantDetails
  }
  category {
    name
    slug
  }
}
    ${VariantDetailsFragmentDoc}`;
export const ProductDetailsFragmentDoc = gql`
    fragment ProductDetails on Product {
  name
  slug
  description
  thumbnail
  filters
  sizingCharts
  category {
    name
    slug
  }
}
    `;
export const FeaturedProductsDocument = gql`
    query FeaturedProducts {
  products(where: {isFeatured: {equals: true}}) {
    ...ProductSummary
  }
}
    ${ProductSummaryFragmentDoc}`;
export const ProductsDocument = gql`
    query Products($limit: Int = 9, $offset: Int = 0) {
  products(take: $limit, skip: $offset, orderBy: {printfulProductId: desc}) {
    ...ProductSummary
  }
  productsCount
}
    ${ProductSummaryFragmentDoc}`;
export const ProductsByCategoryDocument = gql`
    query ProductsByCategory($categorySlug: String, $limit: Int = 9, $offset: Int = 0) {
  category(where: {slug: $categorySlug}) {
    name
    slug
    products(take: $limit, skip: $offset, orderBy: {printfulProductId: desc}) {
      ...ProductSummary
    }
    productsCount
  }
}
    ${ProductSummaryFragmentDoc}`;
export const VariantDocument = gql`
    query Variant($printfulId: String, $productSlug: String) {
  variants(
    where: {printfulVariantId: {equals: $printfulId}, product: {slug: {equals: $productSlug}}}
    orderBy: {printfulVariantId: asc}
  ) {
    ...VariantDetails
    product {
      ...ProductDetails
      variants {
        ...VariantDetails
      }
    }
  }
}
    ${VariantDetailsFragmentDoc}
${ProductDetailsFragmentDoc}`;
export const VariantsDocument = gql`
    query Variants($variantIds: [ID!] = []) {
  variants(where: {id: {in: $variantIds}}) {
    ...VariantDetails
  }
}
    ${VariantDetailsFragmentDoc}`;
export const CategoriesDocument = gql`
    query Categories {
  categories {
    id
    name
    slug
    productsCount
  }
}
    `;
export const ShippingDataKeyDocument = gql`
    query ShippingDataKey($id: ID) {
  shippingDataKey(where: {id: $id}) {
    key
  }
}
    `;
export const AddProcessedOrderDocument = gql`
    mutation AddProcessedOrder($idempotencyKey: String) {
  createProcessedOrder(data: {idempotency_key: $idempotencyKey}) {
    id
  }
}
    `;
export const AddShippingDataKeyDocument = gql`
    mutation AddShippingDataKey($key: String) {
  createShippingDataKey(data: {key: $key}) {
    id
  }
}
    `;
export const DeleteShippingDataKeyDocument = gql`
    mutation DeleteShippingDataKey($id: ID) {
  deleteShippingDataKey(where: {id: $id}) {
    id
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    FeaturedProducts(variables?: FeaturedProductsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<FeaturedProductsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FeaturedProductsQuery>({ document: FeaturedProductsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'FeaturedProducts', 'query', variables);
    },
    Products(variables?: ProductsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ProductsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProductsQuery>({ document: ProductsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Products', 'query', variables);
    },
    ProductsByCategory(variables?: ProductsByCategoryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ProductsByCategoryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProductsByCategoryQuery>({ document: ProductsByCategoryDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ProductsByCategory', 'query', variables);
    },
    Variant(variables?: VariantQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<VariantQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<VariantQuery>({ document: VariantDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Variant', 'query', variables);
    },
    Variants(variables?: VariantsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<VariantsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<VariantsQuery>({ document: VariantsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Variants', 'query', variables);
    },
    Categories(variables?: CategoriesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CategoriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CategoriesQuery>({ document: CategoriesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Categories', 'query', variables);
    },
    ShippingDataKey(variables?: ShippingDataKeyQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ShippingDataKeyQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ShippingDataKeyQuery>({ document: ShippingDataKeyDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ShippingDataKey', 'query', variables);
    },
    AddProcessedOrder(variables?: AddProcessedOrderMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AddProcessedOrderMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddProcessedOrderMutation>({ document: AddProcessedOrderDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AddProcessedOrder', 'mutation', variables);
    },
    AddShippingDataKey(variables?: AddShippingDataKeyMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AddShippingDataKeyMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddShippingDataKeyMutation>({ document: AddShippingDataKeyDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AddShippingDataKey', 'mutation', variables);
    },
    DeleteShippingDataKey(variables?: DeleteShippingDataKeyMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteShippingDataKeyMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteShippingDataKeyMutation>({ document: DeleteShippingDataKeyDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteShippingDataKey', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;