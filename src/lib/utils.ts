import tweetnacl from 'tweetnacl';
const { secretbox, randomBytes } = tweetnacl;
import { encode as encodeUTF8, decode as decodeUTF8 } from '@stablelib/utf8';
import { encode as encodeBase64, decode as decodeBase64 } from '@stablelib/base64';

const sanctionedCountryCodes: Array<string> = ['CU', 'IR', 'KP', 'SY'];
export const blockedCountryCodes: Array<string> = ['BY', 'EC', 'RU', ...sanctionedCountryCodes];

export const formatPrice = (price: string | number, currency = 'USD') => {
  if (typeof price === 'string') {
    price = parseFloat(price);
  }

  return price.toLocaleString('en-US', {
    style: 'currency',
    currency
  });
};

export const sleep = (seconds: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

export class CustomError {
  name: string;
  message: string;

  constructor(message: string) {
    this.name = 'CustomError';
    this.message = message;
  }
}

export class ValidationError {
  name: string;
  message: string;

  constructor(message: string) {
    this.name = 'ValidationError';
    this.message = message;
  }
}

/**
 * Encrypt/Decrypt utils
 * HT: https://github.com/dchest/tweetnacl-js/wiki/Examples#secretbox
 */
const newNonce = () => randomBytes(secretbox.nonceLength);

export const generateKey = () => encodeBase64(randomBytes(secretbox.keyLength));

export const encrypt = (json: object, key: string) => {
  const keyUint8Array = decodeBase64(key);

  const nonce = newNonce();
  const messageUint8 = encodeUTF8(JSON.stringify(json));
  const box = secretbox(messageUint8, nonce, keyUint8Array);

  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
};

export const decrypt = (messageWithNonce: string, key: string) => {
  const keyUint8Array = decodeBase64(key);
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    secretbox.nonceLength,
    messageWithNonce.length
  );

  const decrypted = secretbox.open(message, nonce, keyUint8Array);

  if (!decrypted) {
    throw new Error('Could not decrypt message');
  }

  const base64DecryptedMessage = decodeUTF8(decrypted);
  return JSON.parse(base64DecryptedMessage);
};
