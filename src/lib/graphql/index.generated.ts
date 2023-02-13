import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type FeaturedProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type FeaturedProductsQuery = { __typename?: 'Query', products?: Array<{ __typename?: 'Product', id: string, name?: string | null, priceRange?: Array<number | null> | null, firstVariant?: { __typename?: 'Variant', permalink?: string | null, details?: any | null } | null, category?: { __typename?: 'Category', name?: string | null, slug?: string | null } | null }> | null };

export type ProductsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type ProductsQuery = { __typename?: 'Query', productsCount?: number | null, products?: Array<{ __typename?: 'Product', id: string, name?: string | null, priceRange?: Array<number | null> | null, firstVariant?: { __typename?: 'Variant', permalink?: string | null, details?: any | null } | null, category?: { __typename?: 'Category', name?: string | null, slug?: string | null } | null }> | null };

export type ProductsByCategoryQueryVariables = Exact<{
  categorySlug?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type ProductsByCategoryQuery = { __typename?: 'Query', category?: { __typename?: 'Category', name?: string | null, slug?: string | null, productsCount?: number | null, products?: Array<{ __typename?: 'Product', id: string, name?: string | null, priceRange?: Array<number | null> | null, firstVariant?: { __typename?: 'Variant', permalink?: string | null, details?: any | null } | null, category?: { __typename?: 'Category', name?: string | null, slug?: string | null } | null }> | null } | null };

export type VariantQueryVariables = Exact<{
  printfulId?: InputMaybe<Scalars['String']>;
  productSlug?: InputMaybe<Scalars['String']>;
}>;


export type VariantQuery = { __typename?: 'Query', variants?: Array<{ __typename?: 'Variant', id: string, permalink?: string | null, printfulVariantId?: string | null, details?: any | null, product?: { __typename?: 'Product', name?: string | null, slug?: string | null, description?: string | null, thumbnail?: string | null, filters?: any | null, sizingCharts?: any | null, variants?: Array<{ __typename?: 'Variant', id: string, permalink?: string | null, printfulVariantId?: string | null, details?: any | null }> | null, category?: { __typename?: 'Category', name?: string | null, slug?: string | null } | null } | null }> | null };

export type VariantsQueryVariables = Exact<{
  variantIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;


export type VariantsQuery = { __typename?: 'Query', variants?: Array<{ __typename?: 'Variant', id: string, permalink?: string | null, printfulVariantId?: string | null, details?: any | null }> | null };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories?: Array<{ __typename?: 'Category', id: string, name?: string | null, slug?: string | null, productsCount?: number | null }> | null };

export type AddProcessedOrderMutationVariables = Exact<{
  idempotencyKey?: InputMaybe<Scalars['String']>;
}>;


export type AddProcessedOrderMutation = { __typename?: 'Mutation', createProcessedOrder?: { __typename?: 'ProcessedOrder', id: string } | null };

export type ProductSummaryFragment = { __typename?: 'Product', id: string, name?: string | null, priceRange?: Array<number | null> | null, firstVariant?: { __typename?: 'Variant', permalink?: string | null, details?: any | null } | null, category?: { __typename?: 'Category', name?: string | null, slug?: string | null } | null };

export type ProductDetailsFragment = { __typename?: 'Product', name?: string | null, slug?: string | null, description?: string | null, thumbnail?: string | null, filters?: any | null, sizingCharts?: any | null, category?: { __typename?: 'Category', name?: string | null, slug?: string | null } | null };

export type VariantDetailsFragment = { __typename?: 'Variant', id: string, permalink?: string | null, printfulVariantId?: string | null, details?: any | null };

export const ProductSummaryFragmentDoc = gql`
    fragment ProductSummary on Product {
  id
  name
  priceRange
  firstVariant {
    permalink
    details
  }
  category {
    name
    slug
  }
}
    `;
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
export const VariantDetailsFragmentDoc = gql`
    fragment VariantDetails on Variant {
  id
  permalink
  printfulVariantId
  details
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
export const AddProcessedOrderDocument = gql`
    mutation AddProcessedOrder($idempotencyKey: String) {
  createProcessedOrder(data: {idempotency_key: $idempotencyKey}) {
    id
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    FeaturedProducts(variables?: FeaturedProductsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FeaturedProductsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FeaturedProductsQuery>(FeaturedProductsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'FeaturedProducts', 'query');
    },
    Products(variables?: ProductsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProductsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProductsQuery>(ProductsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Products', 'query');
    },
    ProductsByCategory(variables?: ProductsByCategoryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProductsByCategoryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProductsByCategoryQuery>(ProductsByCategoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ProductsByCategory', 'query');
    },
    Variant(variables?: VariantQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<VariantQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<VariantQuery>(VariantDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Variant', 'query');
    },
    Variants(variables?: VariantsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<VariantsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<VariantsQuery>(VariantsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Variants', 'query');
    },
    Categories(variables?: CategoriesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CategoriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CategoriesQuery>(CategoriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Categories', 'query');
    },
    AddProcessedOrder(variables?: AddProcessedOrderMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddProcessedOrderMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddProcessedOrderMutation>(AddProcessedOrderDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddProcessedOrder', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;