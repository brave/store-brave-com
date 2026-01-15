export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type AuthenticatedItem = User;

export type BooleanFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<BooleanFilter>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  products?: Maybe<Array<Product>>;
  productsCount?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
};


export type CategoryProductsArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  orderBy?: Array<ProductOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ProductWhereInput;
};


export type CategoryProductsCountArgs = {
  where?: ProductWhereInput;
};

export type CategoryCreateInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  products?: InputMaybe<ProductRelateToManyForCreateInput>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryOrderByInput = {
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  slug?: InputMaybe<OrderDirection>;
};

export type CategoryRelateToOneForCreateInput = {
  connect?: InputMaybe<CategoryWhereUniqueInput>;
  create?: InputMaybe<CategoryCreateInput>;
};

export type CategoryRelateToOneForUpdateInput = {
  connect?: InputMaybe<CategoryWhereUniqueInput>;
  create?: InputMaybe<CategoryCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CategoryUpdateArgs = {
  data: CategoryUpdateInput;
  where: CategoryWhereUniqueInput;
};

export type CategoryUpdateInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  products?: InputMaybe<ProductRelateToManyForUpdateInput>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryWhereInput = {
  AND?: InputMaybe<Array<CategoryWhereInput>>;
  NOT?: InputMaybe<Array<CategoryWhereInput>>;
  OR?: InputMaybe<Array<CategoryWhereInput>>;
  id?: InputMaybe<IdFilter>;
  name?: InputMaybe<StringFilter>;
  products?: InputMaybe<ProductManyRelationFilter>;
  slug?: InputMaybe<StringFilter>;
};

export type CategoryWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type CreateInitialUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<DateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type IdFilter = {
  equals?: InputMaybe<Scalars['ID']['input']>;
  gt?: InputMaybe<Scalars['ID']['input']>;
  gte?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lt?: InputMaybe<Scalars['ID']['input']>;
  lte?: InputMaybe<Scalars['ID']['input']>;
  not?: InputMaybe<IdFilter>;
  notIn?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type KeystoneAdminMeta = {
  __typename?: 'KeystoneAdminMeta';
  list?: Maybe<KeystoneAdminUiListMeta>;
  lists: Array<KeystoneAdminUiListMeta>;
};


export type KeystoneAdminMetaListArgs = {
  key: Scalars['String']['input'];
};

export type KeystoneAdminUiFieldGroupMeta = {
  __typename?: 'KeystoneAdminUIFieldGroupMeta';
  description?: Maybe<Scalars['String']['output']>;
  fields: Array<KeystoneAdminUiFieldMeta>;
  label: Scalars['String']['output'];
};

export type KeystoneAdminUiFieldMeta = {
  __typename?: 'KeystoneAdminUIFieldMeta';
  createView: KeystoneAdminUiFieldMetaCreateView;
  customViewsIndex?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  fieldMeta?: Maybe<Scalars['JSON']['output']>;
  isFilterable: Scalars['Boolean']['output'];
  isNonNull?: Maybe<Array<KeystoneAdminUiFieldMetaIsNonNull>>;
  isOrderable: Scalars['Boolean']['output'];
  itemView?: Maybe<KeystoneAdminUiFieldMetaItemView>;
  label: Scalars['String']['output'];
  listView: KeystoneAdminUiFieldMetaListView;
  path: Scalars['String']['output'];
  search?: Maybe<QueryMode>;
  viewsIndex: Scalars['Int']['output'];
};


export type KeystoneAdminUiFieldMetaItemViewArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type KeystoneAdminUiFieldMetaCreateView = {
  __typename?: 'KeystoneAdminUIFieldMetaCreateView';
  fieldMode: KeystoneAdminUiFieldMetaCreateViewFieldMode;
};

export enum KeystoneAdminUiFieldMetaCreateViewFieldMode {
  Edit = 'edit',
  Hidden = 'hidden'
}

export enum KeystoneAdminUiFieldMetaIsNonNull {
  Create = 'create',
  Read = 'read',
  Update = 'update'
}

export type KeystoneAdminUiFieldMetaItemView = {
  __typename?: 'KeystoneAdminUIFieldMetaItemView';
  fieldMode?: Maybe<KeystoneAdminUiFieldMetaItemViewFieldMode>;
  fieldPosition?: Maybe<KeystoneAdminUiFieldMetaItemViewFieldPosition>;
};

export enum KeystoneAdminUiFieldMetaItemViewFieldMode {
  Edit = 'edit',
  Hidden = 'hidden',
  Read = 'read'
}

export enum KeystoneAdminUiFieldMetaItemViewFieldPosition {
  Form = 'form',
  Sidebar = 'sidebar'
}

export type KeystoneAdminUiFieldMetaListView = {
  __typename?: 'KeystoneAdminUIFieldMetaListView';
  fieldMode: KeystoneAdminUiFieldMetaListViewFieldMode;
};

export enum KeystoneAdminUiFieldMetaListViewFieldMode {
  Hidden = 'hidden',
  Read = 'read'
}

export type KeystoneAdminUiGraphQl = {
  __typename?: 'KeystoneAdminUIGraphQL';
  names: KeystoneAdminUiGraphQlNames;
};

export type KeystoneAdminUiGraphQlNames = {
  __typename?: 'KeystoneAdminUIGraphQLNames';
  createInputName: Scalars['String']['output'];
  createManyMutationName: Scalars['String']['output'];
  createMutationName: Scalars['String']['output'];
  deleteManyMutationName: Scalars['String']['output'];
  deleteMutationName: Scalars['String']['output'];
  itemQueryName: Scalars['String']['output'];
  listOrderName: Scalars['String']['output'];
  listQueryCountName: Scalars['String']['output'];
  listQueryName: Scalars['String']['output'];
  outputTypeName: Scalars['String']['output'];
  relateToManyForCreateInputName: Scalars['String']['output'];
  relateToManyForUpdateInputName: Scalars['String']['output'];
  relateToOneForCreateInputName: Scalars['String']['output'];
  relateToOneForUpdateInputName: Scalars['String']['output'];
  updateInputName: Scalars['String']['output'];
  updateManyInputName: Scalars['String']['output'];
  updateManyMutationName: Scalars['String']['output'];
  updateMutationName: Scalars['String']['output'];
  whereInputName: Scalars['String']['output'];
  whereUniqueInputName: Scalars['String']['output'];
};

export type KeystoneAdminUiListMeta = {
  __typename?: 'KeystoneAdminUIListMeta';
  description?: Maybe<Scalars['String']['output']>;
  fields: Array<KeystoneAdminUiFieldMeta>;
  graphql: KeystoneAdminUiGraphQl;
  groups: Array<KeystoneAdminUiFieldGroupMeta>;
  hideCreate: Scalars['Boolean']['output'];
  hideDelete: Scalars['Boolean']['output'];
  initialColumns: Array<Scalars['String']['output']>;
  initialSearchFields: Array<Scalars['String']['output']>;
  initialSort?: Maybe<KeystoneAdminUiSort>;
  isHidden: Scalars['Boolean']['output'];
  isSingleton: Scalars['Boolean']['output'];
  itemQueryName: Scalars['String']['output'];
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  labelField: Scalars['String']['output'];
  listQueryName: Scalars['String']['output'];
  pageSize: Scalars['Int']['output'];
  path: Scalars['String']['output'];
  plural: Scalars['String']['output'];
  singular: Scalars['String']['output'];
};

export type KeystoneAdminUiSort = {
  __typename?: 'KeystoneAdminUISort';
  direction: KeystoneAdminUiSortDirection;
  field: Scalars['String']['output'];
};

export enum KeystoneAdminUiSortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type KeystoneMeta = {
  __typename?: 'KeystoneMeta';
  adminMeta: KeystoneAdminMeta;
};

export type Mutation = {
  __typename?: 'Mutation';
  authenticateUserWithPassword?: Maybe<UserAuthenticationWithPasswordResult>;
  createCategories?: Maybe<Array<Maybe<Category>>>;
  createCategory?: Maybe<Category>;
  createInitialUser: UserAuthenticationWithPasswordSuccess;
  createProcessedOrder?: Maybe<ProcessedOrder>;
  createProcessedOrders?: Maybe<Array<Maybe<ProcessedOrder>>>;
  createProduct?: Maybe<Product>;
  createProducts?: Maybe<Array<Maybe<Product>>>;
  createShippingDataKey?: Maybe<ShippingDataKey>;
  createShippingDataKeys?: Maybe<Array<Maybe<ShippingDataKey>>>;
  createUser?: Maybe<User>;
  createUsers?: Maybe<Array<Maybe<User>>>;
  createVariant?: Maybe<Variant>;
  createVariants?: Maybe<Array<Maybe<Variant>>>;
  deleteCategories?: Maybe<Array<Maybe<Category>>>;
  deleteCategory?: Maybe<Category>;
  deleteProcessedOrder?: Maybe<ProcessedOrder>;
  deleteProcessedOrders?: Maybe<Array<Maybe<ProcessedOrder>>>;
  deleteProduct?: Maybe<Product>;
  deleteProducts?: Maybe<Array<Maybe<Product>>>;
  deleteShippingDataKey?: Maybe<ShippingDataKey>;
  deleteShippingDataKeys?: Maybe<Array<Maybe<ShippingDataKey>>>;
  deleteUser?: Maybe<User>;
  deleteUsers?: Maybe<Array<Maybe<User>>>;
  deleteVariant?: Maybe<Variant>;
  deleteVariants?: Maybe<Array<Maybe<Variant>>>;
  endSession: Scalars['Boolean']['output'];
  updateCategories?: Maybe<Array<Maybe<Category>>>;
  updateCategory?: Maybe<Category>;
  updateProcessedOrder?: Maybe<ProcessedOrder>;
  updateProcessedOrders?: Maybe<Array<Maybe<ProcessedOrder>>>;
  updateProduct?: Maybe<Product>;
  updateProducts?: Maybe<Array<Maybe<Product>>>;
  updateShippingDataKey?: Maybe<ShippingDataKey>;
  updateShippingDataKeys?: Maybe<Array<Maybe<ShippingDataKey>>>;
  updateUser?: Maybe<User>;
  updateUsers?: Maybe<Array<Maybe<User>>>;
  updateVariant?: Maybe<Variant>;
  updateVariants?: Maybe<Array<Maybe<Variant>>>;
};


export type MutationAuthenticateUserWithPasswordArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationCreateCategoriesArgs = {
  data: Array<CategoryCreateInput>;
};


export type MutationCreateCategoryArgs = {
  data: CategoryCreateInput;
};


export type MutationCreateInitialUserArgs = {
  data: CreateInitialUserInput;
};


export type MutationCreateProcessedOrderArgs = {
  data: ProcessedOrderCreateInput;
};


export type MutationCreateProcessedOrdersArgs = {
  data: Array<ProcessedOrderCreateInput>;
};


export type MutationCreateProductArgs = {
  data: ProductCreateInput;
};


export type MutationCreateProductsArgs = {
  data: Array<ProductCreateInput>;
};


export type MutationCreateShippingDataKeyArgs = {
  data: ShippingDataKeyCreateInput;
};


export type MutationCreateShippingDataKeysArgs = {
  data: Array<ShippingDataKeyCreateInput>;
};


export type MutationCreateUserArgs = {
  data: UserCreateInput;
};


export type MutationCreateUsersArgs = {
  data: Array<UserCreateInput>;
};


export type MutationCreateVariantArgs = {
  data: VariantCreateInput;
};


export type MutationCreateVariantsArgs = {
  data: Array<VariantCreateInput>;
};


export type MutationDeleteCategoriesArgs = {
  where: Array<CategoryWhereUniqueInput>;
};


export type MutationDeleteCategoryArgs = {
  where: CategoryWhereUniqueInput;
};


export type MutationDeleteProcessedOrderArgs = {
  where: ProcessedOrderWhereUniqueInput;
};


export type MutationDeleteProcessedOrdersArgs = {
  where: Array<ProcessedOrderWhereUniqueInput>;
};


export type MutationDeleteProductArgs = {
  where: ProductWhereUniqueInput;
};


export type MutationDeleteProductsArgs = {
  where: Array<ProductWhereUniqueInput>;
};


export type MutationDeleteShippingDataKeyArgs = {
  where: ShippingDataKeyWhereUniqueInput;
};


export type MutationDeleteShippingDataKeysArgs = {
  where: Array<ShippingDataKeyWhereUniqueInput>;
};


export type MutationDeleteUserArgs = {
  where: UserWhereUniqueInput;
};


export type MutationDeleteUsersArgs = {
  where: Array<UserWhereUniqueInput>;
};


export type MutationDeleteVariantArgs = {
  where: VariantWhereUniqueInput;
};


export type MutationDeleteVariantsArgs = {
  where: Array<VariantWhereUniqueInput>;
};


export type MutationUpdateCategoriesArgs = {
  data: Array<CategoryUpdateArgs>;
};


export type MutationUpdateCategoryArgs = {
  data: CategoryUpdateInput;
  where: CategoryWhereUniqueInput;
};


export type MutationUpdateProcessedOrderArgs = {
  data: ProcessedOrderUpdateInput;
  where: ProcessedOrderWhereUniqueInput;
};


export type MutationUpdateProcessedOrdersArgs = {
  data: Array<ProcessedOrderUpdateArgs>;
};


export type MutationUpdateProductArgs = {
  data: ProductUpdateInput;
  where: ProductWhereUniqueInput;
};


export type MutationUpdateProductsArgs = {
  data: Array<ProductUpdateArgs>;
};


export type MutationUpdateShippingDataKeyArgs = {
  data: ShippingDataKeyUpdateInput;
  where: ShippingDataKeyWhereUniqueInput;
};


export type MutationUpdateShippingDataKeysArgs = {
  data: Array<ShippingDataKeyUpdateArgs>;
};


export type MutationUpdateUserArgs = {
  data: UserUpdateInput;
  where: UserWhereUniqueInput;
};


export type MutationUpdateUsersArgs = {
  data: Array<UserUpdateArgs>;
};


export type MutationUpdateVariantArgs = {
  data: VariantUpdateInput;
  where: VariantWhereUniqueInput;
};


export type MutationUpdateVariantsArgs = {
  data: Array<VariantUpdateArgs>;
};

export type NestedStringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PasswordState = {
  __typename?: 'PasswordState';
  isSet: Scalars['Boolean']['output'];
};

export type ProcessedOrder = {
  __typename?: 'ProcessedOrder';
  id: Scalars['ID']['output'];
  idempotency_key?: Maybe<Scalars['String']['output']>;
};

export type ProcessedOrderCreateInput = {
  idempotency_key?: InputMaybe<Scalars['String']['input']>;
};

export type ProcessedOrderOrderByInput = {
  id?: InputMaybe<OrderDirection>;
  idempotency_key?: InputMaybe<OrderDirection>;
};

export type ProcessedOrderUpdateArgs = {
  data: ProcessedOrderUpdateInput;
  where: ProcessedOrderWhereUniqueInput;
};

export type ProcessedOrderUpdateInput = {
  idempotency_key?: InputMaybe<Scalars['String']['input']>;
};

export type ProcessedOrderWhereInput = {
  AND?: InputMaybe<Array<ProcessedOrderWhereInput>>;
  NOT?: InputMaybe<Array<ProcessedOrderWhereInput>>;
  OR?: InputMaybe<Array<ProcessedOrderWhereInput>>;
  id?: InputMaybe<IdFilter>;
  idempotency_key?: InputMaybe<StringFilter>;
};

export type ProcessedOrderWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  idempotency_key?: InputMaybe<Scalars['String']['input']>;
};

export type Product = {
  __typename?: 'Product';
  category?: Maybe<Category>;
  description?: Maybe<Scalars['String']['output']>;
  filters?: Maybe<Scalars['JSON']['output']>;
  firstVariant?: Maybe<Variant>;
  id: Scalars['ID']['output'];
  isFeatured?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  priceRange?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  printfulProductId?: Maybe<Scalars['String']['output']>;
  sizingCharts?: Maybe<Scalars['JSON']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  variants?: Maybe<Array<Variant>>;
  variantsCount?: Maybe<Scalars['Int']['output']>;
};


export type ProductVariantsArgs = {
  cursor?: InputMaybe<VariantWhereUniqueInput>;
  orderBy?: Array<VariantOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: VariantWhereInput;
};


export type ProductVariantsCountArgs = {
  where?: VariantWhereInput;
};

export type ProductCreateInput = {
  category?: InputMaybe<CategoryRelateToOneForCreateInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<Scalars['JSON']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  printfulProductId?: InputMaybe<Scalars['String']['input']>;
  sizingCharts?: InputMaybe<Scalars['JSON']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  variants?: InputMaybe<VariantRelateToManyForCreateInput>;
};

export type ProductManyRelationFilter = {
  every?: InputMaybe<ProductWhereInput>;
  none?: InputMaybe<ProductWhereInput>;
  some?: InputMaybe<ProductWhereInput>;
};

export type ProductOrderByInput = {
  description?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  isFeatured?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  printfulProductId?: InputMaybe<OrderDirection>;
  slug?: InputMaybe<OrderDirection>;
  thumbnail?: InputMaybe<OrderDirection>;
};

export type ProductRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<ProductWhereUniqueInput>>;
  create?: InputMaybe<Array<ProductCreateInput>>;
};

export type ProductRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<ProductWhereUniqueInput>>;
  create?: InputMaybe<Array<ProductCreateInput>>;
  disconnect?: InputMaybe<Array<ProductWhereUniqueInput>>;
  set?: InputMaybe<Array<ProductWhereUniqueInput>>;
};

export type ProductRelateToOneForCreateInput = {
  connect?: InputMaybe<ProductWhereUniqueInput>;
  create?: InputMaybe<ProductCreateInput>;
};

export type ProductRelateToOneForUpdateInput = {
  connect?: InputMaybe<ProductWhereUniqueInput>;
  create?: InputMaybe<ProductCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ProductUpdateArgs = {
  data: ProductUpdateInput;
  where: ProductWhereUniqueInput;
};

export type ProductUpdateInput = {
  category?: InputMaybe<CategoryRelateToOneForUpdateInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<Scalars['JSON']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  printfulProductId?: InputMaybe<Scalars['String']['input']>;
  sizingCharts?: InputMaybe<Scalars['JSON']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  variants?: InputMaybe<VariantRelateToManyForUpdateInput>;
};

export type ProductWhereInput = {
  AND?: InputMaybe<Array<ProductWhereInput>>;
  NOT?: InputMaybe<Array<ProductWhereInput>>;
  OR?: InputMaybe<Array<ProductWhereInput>>;
  category?: InputMaybe<CategoryWhereInput>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<IdFilter>;
  isFeatured?: InputMaybe<BooleanFilter>;
  name?: InputMaybe<StringFilter>;
  printfulProductId?: InputMaybe<StringFilter>;
  slug?: InputMaybe<StringFilter>;
  thumbnail?: InputMaybe<StringFilter>;
  variants?: InputMaybe<VariantManyRelationFilter>;
};

export type ProductWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  printfulProductId?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  authenticatedItem?: Maybe<AuthenticatedItem>;
  categories?: Maybe<Array<Category>>;
  categoriesCount?: Maybe<Scalars['Int']['output']>;
  category?: Maybe<Category>;
  keystone: KeystoneMeta;
  processedOrder?: Maybe<ProcessedOrder>;
  processedOrders?: Maybe<Array<ProcessedOrder>>;
  processedOrdersCount?: Maybe<Scalars['Int']['output']>;
  product?: Maybe<Product>;
  products?: Maybe<Array<Product>>;
  productsCount?: Maybe<Scalars['Int']['output']>;
  shippingDataKey?: Maybe<ShippingDataKey>;
  shippingDataKeys?: Maybe<Array<ShippingDataKey>>;
  shippingDataKeysCount?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
  usersCount?: Maybe<Scalars['Int']['output']>;
  variant?: Maybe<Variant>;
  variants?: Maybe<Array<Variant>>;
  variantsCount?: Maybe<Scalars['Int']['output']>;
};


export type QueryCategoriesArgs = {
  cursor?: InputMaybe<CategoryWhereUniqueInput>;
  orderBy?: Array<CategoryOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: CategoryWhereInput;
};


export type QueryCategoriesCountArgs = {
  where?: CategoryWhereInput;
};


export type QueryCategoryArgs = {
  where: CategoryWhereUniqueInput;
};


export type QueryProcessedOrderArgs = {
  where: ProcessedOrderWhereUniqueInput;
};


export type QueryProcessedOrdersArgs = {
  cursor?: InputMaybe<ProcessedOrderWhereUniqueInput>;
  orderBy?: Array<ProcessedOrderOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ProcessedOrderWhereInput;
};


export type QueryProcessedOrdersCountArgs = {
  where?: ProcessedOrderWhereInput;
};


export type QueryProductArgs = {
  where: ProductWhereUniqueInput;
};


export type QueryProductsArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  orderBy?: Array<ProductOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ProductWhereInput;
};


export type QueryProductsCountArgs = {
  where?: ProductWhereInput;
};


export type QueryShippingDataKeyArgs = {
  where: ShippingDataKeyWhereUniqueInput;
};


export type QueryShippingDataKeysArgs = {
  cursor?: InputMaybe<ShippingDataKeyWhereUniqueInput>;
  orderBy?: Array<ShippingDataKeyOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ShippingDataKeyWhereInput;
};


export type QueryShippingDataKeysCountArgs = {
  where?: ShippingDataKeyWhereInput;
};


export type QueryUserArgs = {
  where: UserWhereUniqueInput;
};


export type QueryUsersArgs = {
  cursor?: InputMaybe<UserWhereUniqueInput>;
  orderBy?: Array<UserOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: UserWhereInput;
};


export type QueryUsersCountArgs = {
  where?: UserWhereInput;
};


export type QueryVariantArgs = {
  where: VariantWhereUniqueInput;
};


export type QueryVariantsArgs = {
  cursor?: InputMaybe<VariantWhereUniqueInput>;
  orderBy?: Array<VariantOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: VariantWhereInput;
};


export type QueryVariantsCountArgs = {
  where?: VariantWhereInput;
};

export enum QueryMode {
  Default = 'default',
  Insensitive = 'insensitive'
}

export type ShippingDataKey = {
  __typename?: 'ShippingDataKey';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  key?: Maybe<Scalars['String']['output']>;
};

export type ShippingDataKeyCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
};

export type ShippingDataKeyOrderByInput = {
  createdAt?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  key?: InputMaybe<OrderDirection>;
};

export type ShippingDataKeyUpdateArgs = {
  data: ShippingDataKeyUpdateInput;
  where: ShippingDataKeyWhereUniqueInput;
};

export type ShippingDataKeyUpdateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
};

export type ShippingDataKeyWhereInput = {
  AND?: InputMaybe<Array<ShippingDataKeyWhereInput>>;
  NOT?: InputMaybe<Array<ShippingDataKeyWhereInput>>;
  OR?: InputMaybe<Array<ShippingDataKeyWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<IdFilter>;
  key?: InputMaybe<StringFilter>;
};

export type ShippingDataKeyWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<PasswordState>;
};

export type UserAuthenticationWithPasswordFailure = {
  __typename?: 'UserAuthenticationWithPasswordFailure';
  message: Scalars['String']['output'];
};

export type UserAuthenticationWithPasswordResult = UserAuthenticationWithPasswordFailure | UserAuthenticationWithPasswordSuccess;

export type UserAuthenticationWithPasswordSuccess = {
  __typename?: 'UserAuthenticationWithPasswordSuccess';
  item: User;
  sessionToken: Scalars['String']['output'];
};

export type UserCreateInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type UserOrderByInput = {
  email?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
};

export type UserUpdateArgs = {
  data: UserUpdateInput;
  where: UserWhereUniqueInput;
};

export type UserUpdateInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  email?: InputMaybe<StringFilter>;
  id?: InputMaybe<IdFilter>;
  name?: InputMaybe<StringFilter>;
};

export type UserWhereUniqueInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Variant = {
  __typename?: 'Variant';
  details?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  permalink?: Maybe<Scalars['String']['output']>;
  printfulVariantId?: Maybe<Scalars['String']['output']>;
  product?: Maybe<Product>;
};

export type VariantCreateInput = {
  details?: InputMaybe<Scalars['JSON']['input']>;
  printfulVariantId?: InputMaybe<Scalars['String']['input']>;
  product?: InputMaybe<ProductRelateToOneForCreateInput>;
};

export type VariantManyRelationFilter = {
  every?: InputMaybe<VariantWhereInput>;
  none?: InputMaybe<VariantWhereInput>;
  some?: InputMaybe<VariantWhereInput>;
};

export type VariantOrderByInput = {
  id?: InputMaybe<OrderDirection>;
  printfulVariantId?: InputMaybe<OrderDirection>;
};

export type VariantRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<VariantWhereUniqueInput>>;
  create?: InputMaybe<Array<VariantCreateInput>>;
};

export type VariantRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<VariantWhereUniqueInput>>;
  create?: InputMaybe<Array<VariantCreateInput>>;
  disconnect?: InputMaybe<Array<VariantWhereUniqueInput>>;
  set?: InputMaybe<Array<VariantWhereUniqueInput>>;
};

export type VariantUpdateArgs = {
  data: VariantUpdateInput;
  where: VariantWhereUniqueInput;
};

export type VariantUpdateInput = {
  details?: InputMaybe<Scalars['JSON']['input']>;
  printfulVariantId?: InputMaybe<Scalars['String']['input']>;
  product?: InputMaybe<ProductRelateToOneForUpdateInput>;
};

export type VariantWhereInput = {
  AND?: InputMaybe<Array<VariantWhereInput>>;
  NOT?: InputMaybe<Array<VariantWhereInput>>;
  OR?: InputMaybe<Array<VariantWhereInput>>;
  id?: InputMaybe<IdFilter>;
  printfulVariantId?: InputMaybe<StringFilter>;
  product?: InputMaybe<ProductWhereInput>;
};

export type VariantWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  printfulVariantId?: InputMaybe<Scalars['String']['input']>;
};
