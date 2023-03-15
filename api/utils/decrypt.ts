import tweetnacl from 'tweetnacl';
const { secretbox } = tweetnacl;
import { decode as decodeUTF8 } from '@stablelib/utf8';
import { decode as decodeBase64 } from '@stablelib/base64';

/**
 * Decrypt utils
 * HT: https://github.com/dchest/tweetnacl-js/wiki/Examples#secretbox
 */
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
