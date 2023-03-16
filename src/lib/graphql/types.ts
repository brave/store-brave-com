export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type AuthenticatedItem = User;

export type BooleanFilter = {
  equals?: InputMaybe<Scalars['Boolean']>;
  not?: InputMaybe<BooleanFilter>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  products?: Maybe<Array<Product>>;
  productsCount?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
};


export type CategoryProductsArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  orderBy?: Array<ProductOrderByInput>;
  skip?: Scalars['Int'];
  take?: InputMaybe<Scalars['Int']>;
  where?: ProductWhereInput;
};


export type CategoryProductsCountArgs = {
  where?: ProductWhereInput;
};

export type CategoryCreateInput = {
  name?: InputMaybe<Scalars['String']>;
  products?: InputMaybe<ProductRelateToManyForCreateInput>;
  slug?: InputMaybe<Scalars['String']>;
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
  disconnect?: InputMaybe<Scalars['Boolean']>;
};

export type CategoryUpdateArgs = {
  data: CategoryUpdateInput;
  where: CategoryWhereUniqueInput;
};

export type CategoryUpdateInput = {
  name?: InputMaybe<Scalars['String']>;
  products?: InputMaybe<ProductRelateToManyForUpdateInput>;
  slug?: InputMaybe<Scalars['String']>;
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
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type CreateInitialUserInput = {
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<Scalars['DateTime']>>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  not?: InputMaybe<DateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']>>;
};

export type IdFilter = {
  equals?: InputMaybe<Scalars['ID']>;
  gt?: InputMaybe<Scalars['ID']>;
  gte?: InputMaybe<Scalars['ID']>;
  in?: InputMaybe<Array<Scalars['ID']>>;
  lt?: InputMaybe<Scalars['ID']>;
  lte?: InputMaybe<Scalars['ID']>;
  not?: InputMaybe<IdFilter>;
  notIn?: InputMaybe<Array<Scalars['ID']>>;
};

export type KeystoneAdminMeta = {
  __typename?: 'KeystoneAdminMeta';
  list?: Maybe<KeystoneAdminUiListMeta>;
  lists: Array<KeystoneAdminUiListMeta>;
};


export type KeystoneAdminMetaListArgs = {
  key: Scalars['String'];
};

export type KeystoneAdminUiFieldGroupMeta = {
  __typename?: 'KeystoneAdminUIFieldGroupMeta';
  description?: Maybe<Scalars['String']>;
  fields: Array<KeystoneAdminUiFieldMeta>;
  label: Scalars['String'];
};

export type KeystoneAdminUiFieldMeta = {
  __typename?: 'KeystoneAdminUIFieldMeta';
  createView: KeystoneAdminUiFieldMetaCreateView;
  customViewsIndex?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  fieldMeta?: Maybe<Scalars['JSON']>;
  isFilterable: Scalars['Boolean'];
  isNonNull?: Maybe<Array<KeystoneAdminUiFieldMetaIsNonNull>>;
  isOrderable: Scalars['Boolean'];
  itemView?: Maybe<KeystoneAdminUiFieldMetaItemView>;
  label: Scalars['String'];
  listView: KeystoneAdminUiFieldMetaListView;
  path: Scalars['String'];
  search?: Maybe<QueryMode>;
  viewsIndex: Scalars['Int'];
};


export type KeystoneAdminUiFieldMetaItemViewArgs = {
  id?: InputMaybe<Scalars['ID']>;
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

export type KeystoneAdminUiListMeta = {
  __typename?: 'KeystoneAdminUIListMeta';
  description?: Maybe<Scalars['String']>;
  fields: Array<KeystoneAdminUiFieldMeta>;
  groups: Array<KeystoneAdminUiFieldGroupMeta>;
  hideCreate: Scalars['Boolean'];
  hideDelete: Scalars['Boolean'];
  initialColumns: Array<Scalars['String']>;
  initialSort?: Maybe<KeystoneAdminUiSort>;
  isHidden: Scalars['Boolean'];
  isSingleton: Scalars['Boolean'];
  itemQueryName: Scalars['String'];
  key: Scalars['String'];
  label: Scalars['String'];
  labelField: Scalars['String'];
  listQueryName: Scalars['String'];
  pageSize: Scalars['Int'];
  path: Scalars['String'];
  plural: Scalars['String'];
  singular: Scalars['String'];
};

export type KeystoneAdminUiSort = {
  __typename?: 'KeystoneAdminUISort';
  direction: KeystoneAdminUiSortDirection;
  field: Scalars['String'];
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
  endSession: Scalars['Boolean'];
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
  email: Scalars['String'];
  password: Scalars['String'];
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
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PasswordState = {
  __typename?: 'PasswordState';
  isSet: Scalars['Boolean'];
};

export type ProcessedOrder = {
  __typename?: 'ProcessedOrder';
  id: Scalars['ID'];
  idempotency_key?: Maybe<Scalars['String']>;
};

export type ProcessedOrderCreateInput = {
  idempotency_key?: InputMaybe<Scalars['String']>;
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
  idempotency_key?: InputMaybe<Scalars['String']>;
};

export type ProcessedOrderWhereInput = {
  AND?: InputMaybe<Array<ProcessedOrderWhereInput>>;
  NOT?: InputMaybe<Array<ProcessedOrderWhereInput>>;
  OR?: InputMaybe<Array<ProcessedOrderWhereInput>>;
  id?: InputMaybe<IdFilter>;
  idempotency_key?: InputMaybe<StringFilter>;
};

export type ProcessedOrderWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>;
  idempotency_key?: InputMaybe<Scalars['String']>;
};

export type Product = {
  __typename?: 'Product';
  category?: Maybe<Category>;
  description?: Maybe<Scalars['String']>;
  filters?: Maybe<Scalars['JSON']>;
  firstVariant?: Maybe<Variant>;
  id: Scalars['ID'];
  isFeatured?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  priceRange?: Maybe<Array<Maybe<Scalars['Float']>>>;
  printfulProductId?: Maybe<Scalars['String']>;
  sizingCharts?: Maybe<Scalars['JSON']>;
  slug?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  variants?: Maybe<Array<Variant>>;
  variantsCount?: Maybe<Scalars['Int']>;
};


export type ProductVariantsArgs = {
  cursor?: InputMaybe<VariantWhereUniqueInput>;
  orderBy?: Array<VariantOrderByInput>;
  skip?: Scalars['Int'];
  take?: InputMaybe<Scalars['Int']>;
  where?: VariantWhereInput;
};


export type ProductVariantsCountArgs = {
  where?: VariantWhereInput;
};

export type ProductCreateInput = {
  category?: InputMaybe<CategoryRelateToOneForCreateInput>;
  description?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<Scalars['JSON']>;
  isFeatured?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  printfulProductId?: InputMaybe<Scalars['String']>;
  sizingCharts?: InputMaybe<Scalars['JSON']>;
  slug?: InputMaybe<Scalars['String']>;
  thumbnail?: InputMaybe<Scalars['String']>;
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
  disconnect?: InputMaybe<Scalars['Boolean']>;
};

export type ProductUpdateArgs = {
  data: ProductUpdateInput;
  where: ProductWhereUniqueInput;
};

export type ProductUpdateInput = {
  category?: InputMaybe<CategoryRelateToOneForUpdateInput>;
  description?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<Scalars['JSON']>;
  isFeatured?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  printfulProductId?: InputMaybe<Scalars['String']>;
  sizingCharts?: InputMaybe<Scalars['JSON']>;
  slug?: InputMaybe<Scalars['String']>;
  thumbnail?: InputMaybe<Scalars['String']>;
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
  id?: InputMaybe<Scalars['ID']>;
  printfulProductId?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  authenticatedItem?: Maybe<AuthenticatedItem>;
  categories?: Maybe<Array<Category>>;
  categoriesCount?: Maybe<Scalars['Int']>;
  category?: Maybe<Category>;
  keystone: KeystoneMeta;
  processedOrder?: Maybe<ProcessedOrder>;
  processedOrders?: Maybe<Array<ProcessedOrder>>;
  processedOrdersCount?: Maybe<Scalars['Int']>;
  product?: Maybe<Product>;
  products?: Maybe<Array<Product>>;
  productsCount?: Maybe<Scalars['Int']>;
  shippingDataKey?: Maybe<ShippingDataKey>;
  shippingDataKeys?: Maybe<Array<ShippingDataKey>>;
  shippingDataKeysCount?: Maybe<Scalars['Int']>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
  usersCount?: Maybe<Scalars['Int']>;
  variant?: Maybe<Variant>;
  variants?: Maybe<Array<Variant>>;
  variantsCount?: Maybe<Scalars['Int']>;
};


export type QueryCategoriesArgs = {
  cursor?: InputMaybe<CategoryWhereUniqueInput>;
  orderBy?: Array<CategoryOrderByInput>;
  skip?: Scalars['Int'];
  take?: InputMaybe<Scalars['Int']>;
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
  skip?: Scalars['Int'];
  take?: InputMaybe<Scalars['Int']>;
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
  skip?: Scalars['Int'];
  take?: InputMaybe<Scalars['Int']>;
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
  skip?: Scalars['Int'];
  take?: InputMaybe<Scalars['Int']>;
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
  skip?: Scalars['Int'];
  take?: InputMaybe<Scalars['Int']>;
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
  skip?: Scalars['Int'];
  take?: InputMaybe<Scalars['Int']>;
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
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  key?: Maybe<Scalars['String']>;
};

export type ShippingDataKeyCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  key?: InputMaybe<Scalars['String']>;
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
  createdAt?: InputMaybe<Scalars['DateTime']>;
  key?: InputMaybe<Scalars['String']>;
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
  id?: InputMaybe<Scalars['ID']>;
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  password?: Maybe<PasswordState>;
};

export type UserAuthenticationWithPasswordFailure = {
  __typename?: 'UserAuthenticationWithPasswordFailure';
  message: Scalars['String'];
};

export type UserAuthenticationWithPasswordResult = UserAuthenticationWithPasswordFailure | UserAuthenticationWithPasswordSuccess;

export type UserAuthenticationWithPasswordSuccess = {
  __typename?: 'UserAuthenticationWithPasswordSuccess';
  item: User;
  sessionToken: Scalars['String'];
};

export type UserCreateInput = {
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
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
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
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
  email?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

export type Variant = {
  __typename?: 'Variant';
  details?: Maybe<Scalars['JSON']>;
  id: Scalars['ID'];
  permalink?: Maybe<Scalars['String']>;
  printfulVariantId?: Maybe<Scalars['String']>;
  product?: Maybe<Product>;
};

export type VariantCreateInput = {
  details?: InputMaybe<Scalars['JSON']>;
  printfulVariantId?: InputMaybe<Scalars['String']>;
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
  details?: InputMaybe<Scalars['JSON']>;
  printfulVariantId?: InputMaybe<Scalars['String']>;
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
  id?: InputMaybe<Scalars['ID']>;
  printfulVariantId?: InputMaybe<Scalars['String']>;
};
