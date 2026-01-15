import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type FeaturedProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type FeaturedProductsQuery = { __typename?: 'Query', products?: Array<{ __typename?: 'Product', id: string, name?: string | null, slug?: string | null, priceRange?: Array<number | null> | null, filters?: any | null, firstVariant?: { __typename?: 'Variant', permalink?: string | null, details?: any | null } | null, variants?: Array<{ __typename?: 'Variant', id: string, permalink?: string | null, printfulVariantId?: string | null, details?: any | null }> | null, category?: { __typename?: 'Category', name?: string | null, slug?: string | null } | null }> | null };

export type ProductsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ProductsQuery = { __typename?: 'Query', productsCount?: number | null, products?: Array<{ __typename?: 'Product', id: string, name?: string | null, slug?: string | null, priceRange?: Array<number | null> | null, filters?: any | null, firstVariant?: { __typename?: 'Variant', permalink?: string | null, details?: any | null } | null, variants?: Array<{ __typename?: 'Variant', id: string, permalink?: string | null, printfulVariantId?: string | null, details?: any | null }> | null, category?: { __typename?: 'Category', name?: string | null, slug?: string | null } | null }> | null };

export type ProductsByCategoryQueryVariables = Exact<{
  categorySlug?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ProductsByCategoryQuery = { __typename?: 'Query', category?: { __typename?: 'Category', name?: string | null, slug?: string | null, productsCount?: number | null, products?: Array<{ __typename?: 'Product', id: string, name?: string | null, slug?: string | null, priceRange?: Array<number | null> | null, filters?: any | null, firstVariant?: { __typename?: 'Variant', permalink?: string | null, details?: any | null } | null, variants?: Array<{ __typename?: 'Variant', id: string, permalink?: string | null, printfulVariantId?: string | null, details?: any | null }> | null, category?: { __typename?: 'Category', name?: string | null, slug?: string | null } | null }> | null } | null };

export type VariantQueryVariables = Exact<{
  printfulId?: InputMaybe<Scalars['String']['input']>;
  productSlug?: InputMaybe<Scalars['String']['input']>;
}>;


export type VariantQuery = { __typename?: 'Query', variants?: Array<{ __typename?: 'Variant', id: string, permalink?: string | null, printfulVariantId?: string | null, details?: any | null, product?: { __typename?: 'Product', name?: string | null, slug?: string | null, description?: string | null, thumbnail?: string | null, filters?: any | null, sizingCharts?: any | null, variants?: Array<{ __typename?: 'Variant', id: string, permalink?: string | null, printfulVariantId?: string | null, details?: any | null }> | null, category?: { __typename?: 'Category', name?: string | null, slug?: string | null } | null } | null }> | null };

export type VariantsQueryVariables = Exact<{
  variantIds?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type VariantsQuery = { __typename?: 'Query', variants?: Array<{ __typename?: 'Variant', id: string, permalink?: string | null, printfulVariantId?: string | null, details?: any | null }> | null };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories?: Array<{ __typename?: 'Category', id: string, name?: string | null, slug?: string | null, productsCount?: number | null }> | null };

export type ShippingDataKeyQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type ShippingDataKeyQuery = { __typename?: 'Query', shippingDataKey?: { __typename?: 'ShippingDataKey', key?: string | null } | null };

export type AddProcessedOrderMutationVariables = Exact<{
  idempotencyKey?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddProcessedOrderMutation = { __typename?: 'Mutation', createProcessedOrder?: { __typename?: 'ProcessedOrder', id: string } | null };

export type AddShippingDataKeyMutationVariables = Exact<{
  key?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddShippingDataKeyMutation = { __typename?: 'Mutation', createShippingDataKey?: { __typename?: 'ShippingDataKey', id: string } | null };

export type DeleteShippingDataKeyMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type DeleteShippingDataKeyMutation = { __typename?: 'Mutation', deleteShippingDataKey?: { __typename?: 'ShippingDataKey', id: string } | null };

export type ProductSummaryFragment = { __typename?: 'Product', id: string, name?: string | null, slug?: string | null, priceRange?: Array<number | null> | null, filters?: any | null, firstVariant?: { __typename?: 'Variant', permalink?: string | null, details?: any | null } | null, variants?: Array<{ __typename?: 'Variant', id: string, permalink?: string | null, printfulVariantId?: string | null, details?: any | null }> | null, category?: { __typename?: 'Category', name?: string | null, slug?: string | null } | null };

export type ProductDetailsFragment = { __typename?: 'Product', name?: string | null, slug?: string | null, description?: string | null, thumbnail?: string | null, filters?: any | null, sizingCharts?: any | null, category?: { __typename?: 'Category', name?: string | null, slug?: string | null } | null };

export type VariantDetailsFragment = { __typename?: 'Variant', id: string, permalink?: string | null, printfulVariantId?: string | null, details?: any | null };

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