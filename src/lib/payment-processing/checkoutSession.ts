import { sdk } from '$lib/graphql/sdk';
import { printfulApi, type PrintfulShippingRate } from '$lib/printful-api';
import { blockedCountryCodes, CustomError, encrypt, formatDate, generateKey } from '$lib/utils';
import type { CountryCode } from 'libphonenumber-js';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js/max';
import type { CartRequestBody } from '../../routes/cart/+page.server';
import type {
  EncryptedShippingAddress,
  HydratedCartItem,
  ProviderDataAdapter,
  ShippingAddress,
  ShippingRate,
  StrongVariant
} from './types';

export enum CreateCheckoutSessionError {
  INVALID_SHIPPING_ADDRESS = 'Invalid shipping address',
  EMPTY_CART = 'Empty cart',
  SHIPPING_DATA_KEY_DOES_NOT_EXIST = 'Could not get shipping data key id.'
}

const cleanShippingAddress = (shippingAddress: ShippingAddress) => {
  // Clone shippingAddress
  shippingAddress = { ...shippingAddress };

  // Remove empty items from shippingAddress
  // Remove unwanted characters from inputs
  let key: keyof ShippingAddress;
  for (key in shippingAddress) {
    if (!shippingAddress[key]) {
      delete shippingAddress[key];
    } else {
      shippingAddress[key] = shippingAddress[key]?.replace(/<|>/gm, '') || '';
    }
  }

  return shippingAddress;
};

const validateShippingAddress = (address: ShippingAddress) => {
  const callingCodeCountry = address.calling_code?.split('+').at(0) as CountryCode;
  const errors: any = {
    shippingAddress: {}
  };
  if (!address.address1) {
    errors.shippingAddress.hasErrors = true;
    errors.shippingAddress.address1 = { missing: true };
  }
  if (!address.city) {
    errors.shippingAddress.hasErrors = true;
    errors.shippingAddress.city = { missing: true };
  }
  if (!address.zip) {
    errors.shippingAddress.hasErrors = true;
    errors.shippingAddress.zip = { missing: true };
  }
  if (!address.country_code) {
    errors.shippingAddress.hasErrors = true;
    errors.shippingAddress.country_code = { missing: true };
  }
  if (blockedCountryCodes.includes(address.country_code)) {
    errors.shippingAddress.hasErrors = true;
    errors.shippingAddress.country_code = { invalidRegion: true };
  }
  if (!address.state_code) {
    errors.shippingAddress.hasErrors = true;
    errors.shippingAddress.state_code = { missing: true };
  }
  if (address.phone && !isValidPhoneNumber(address.phone, callingCodeCountry)) {
    errors.shippingAddress.hasErrors = true;
    errors.shippingAddress.phone = { invalid: true };
  }

  if (errors.shippingAddress?.hasErrors) {
    throw new CustomError(CreateCheckoutSessionError.INVALID_SHIPPING_ADDRESS, { errors, values: address });
  }
};

const getCustomShippingName = (shippingRate: PrintfulShippingRate) => {
  const shippingNameMappings: Record<string, string> = {
    STANDARD: 'Standard',
    PRINTFUL_FAST: 'Express'
  };

  let shippingName = shippingNameMappings[shippingRate.id] || shippingRate.name;

  const minDate =
    shippingRate?.minDeliveryDate && new Date(shippingRate.minDeliveryDate + 'T00:00:00');
  const maxDate =
    shippingRate?.maxDeliveryDate && new Date(shippingRate.maxDeliveryDate + 'T00:00:00');

  if (minDate && maxDate && minDate.getDate() === maxDate.getDate()) {
    shippingName += ` (Estimated delivery: ${formatDate(maxDate)})`;
  } else if (minDate && maxDate) {
    shippingName += ` (Estimated delivery: ${formatDate(minDate)}-${formatDate(maxDate)})`;
  } else if (minDate) {
    shippingName += ` (Estimated delivery: ${formatDate(minDate)})`;
  } else if (maxDate) {
    shippingName += ` (Estimated delivery: ${formatDate(maxDate)})`;
  }

  return shippingName;
};

const formatRecipientInfo = (shippingAddress: ShippingAddress): App.Recipient => {
  // Clone shippingAddress
  shippingAddress = { ...shippingAddress };

  const callingCodeCountry = shippingAddress.calling_code?.split('+').at(0) as CountryCode;
  delete shippingAddress.calling_code;

  let recipientInformation = shippingAddress as App.Recipient;

  if (recipientInformation.state_code === 'N/A') {
    const { state_code, ...rest } = recipientInformation;
    recipientInformation = rest;
  }

  if (recipientInformation.phone) {
    const parsedNumber = parsePhoneNumber(recipientInformation.phone, callingCodeCountry);
    recipientInformation.phone = parsedNumber.formatInternational();
  }

  return recipientInformation;
};

const hydrateItemsFromDb = async (
  items: CartRequestBody['items']
): Promise<Array<HydratedCartItem>> => {
  // Get product variant details from DB
  const { variants } = await sdk.Variants({
    variantIds: items.map((v) => v.id)
  });

  const typedVariants = variants ?? ([] as Array<StrongVariant>);

  // TODO: (maybe) return error if could not find all products in DB
  // Maybe user had super old session data hanging around after products have been changed... probably not very likely given that this is sessionStorage.

  // Create lookup table using variant ID as the key
  const variantDetailsHash: Record<string, Omit<StrongVariant, 'id'>> = typedVariants.reduce(
    (accumulatorHash, { id, ...rest }) => {
      return {
        ...accumulatorHash,
        [id]: rest
      };
    },
    {}
  );

  return items.map((item) => ({
    id: item.id,
    ...variantDetailsHash[item.id],
    quantity: Number(item.quantity)
  }));
};

const getShippingRates = async (
  items: Array<HydratedCartItem>,
  recipientInformation: App.Recipient
): Promise<Array<ShippingRate>> => {
  const itemsForPrintfulShipping = items.map((item) => {
    return {
      variant_id: item.details.baseVariantId,
      quantity: item.quantity
    };
  });

  const shippingRates = await printfulApi('/shipping/rates', {
    method: 'POST',
    body: JSON.stringify({
      recipient: recipientInformation,
      items: itemsForPrintfulShipping
    })
  });

  return shippingRates.map((rate: PrintfulShippingRate) => ({
    ...rate,
    displayName: getCustomShippingName(rate)
  })) as Array<ShippingRate>;
};

const encryptShippingData = async (
  recipientInformation: App.Recipient
): Promise<EncryptedShippingAddress> => {
  const encryptionKey = generateKey();
  const encryptedData = encrypt(recipientInformation, encryptionKey);

  // Store encryption key in DB
  const { createShippingDataKey: shippingDataKey } = await sdk.AddShippingDataKey({
    key: encryptionKey
  });

  if (!shippingDataKey?.id) {
    throw new CustomError(CreateCheckoutSessionError.SHIPPING_DATA_KEY_DOES_NOT_EXIST);
  }

  return {
    encryptedData,
    encryptionKeyId: shippingDataKey.id
  };
};

export async function formatCheckoutSessionData<ProviderCheckoutData>(
  requestBody: CartRequestBody,
  providerAdapter: ProviderDataAdapter<ProviderCheckoutData>
): Promise<ProviderCheckoutData> {
  let { items, shippingAddress } = requestBody;

  if (!items?.length) {
    throw new CustomError(CreateCheckoutSessionError.EMPTY_CART);
  }

  const cleanedShippingAddress = cleanShippingAddress(shippingAddress);

  try {
    validateShippingAddress(cleanedShippingAddress);
  } catch (e) {
    throw e;
  }

  const recipientInformation = formatRecipientInfo(cleanedShippingAddress);

  const hydratedItems = await hydrateItemsFromDb(items);

  const shippingRates = await getShippingRates(hydratedItems, recipientInformation);

  try {
    const encryptedShippingData = await encryptShippingData(recipientInformation);

    return providerAdapter(
      hydratedItems,
      encryptedShippingData,
      shippingRates
    ) as ProviderCheckoutData;
  } catch (e: any) {
    throw e;
  }
}
