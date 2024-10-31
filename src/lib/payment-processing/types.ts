import type { Variant } from '$lib/graphql/types';
import type { PrintfulShippingRate } from '$lib/printful-api';

export type ShippingRate = PrintfulShippingRate & { displayName: string };

export type ShippingAddress = {
  name?: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
  country_code: string;
  state_code?: string;
  phone?: string;
  calling_code?: string;
};

export type EncryptedShippingAddress = {
  encryptionKeyId: string;
  encryptedData: string;
};

export interface StrongVariant extends Omit<Variant, 'details'> {
  printfulVariantId: string;
  details: {
    currency: string;
    name: string;
    files: { thumbnail_url: string }[];
    baseVariantId: string;
    price: number;
  };
}

export type HydratedCartItem = StrongVariant & {
  quantity: number;
};

export type ProviderParamsAdapter<SessionCreateParams> = (
  items: HydratedCartItem[],
  recipient: App.Recipient,
  encryptedShippingData: EncryptedShippingAddress,
  shippingRates: ShippingRate[]
) => SessionCreateParams;

export type SessionDetails = {
  id: string;
  url: string;
};
