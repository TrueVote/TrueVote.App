import { getPublicKey, nip19 } from 'nostr-tools';
import { DecodeResult } from 'nostr-tools/lib/types/nip19';
import React from 'react';

const hexchars: string = '0123456789abcdef';
const invalidKeyError: string = 'Invalid key';
const invalidHexKeyError: string = 'Invalid hex key';
const invalidHexDecodeError: string = 'Invalid hex key - could not decode nip19';
const exceptionError: string = 'Invalid key - exception';
const validKeyMessage: string = 'Valid key';
const invalidPubKeyError: string = 'Invalid key - public key';

const nostrPrivateKeyStorageKey: string = 'nostr_sk';
const nostrPublicKeyStorageKey: string = 'nostr_pk';

export const nostrKeyKeyHandler: (e: React.ChangeEvent<HTMLInputElement>) => {
  error: string;
  message: string;
  valid: boolean;
} = (e: React.ChangeEvent<HTMLInputElement>) => {
  let val: string = e.target.value.toLowerCase();
  let error: string = '';
  let message: string = '';
  let valid: boolean = false;

  if (val.length === 0) {
    return { error, message, valid };
  }

  try {
    if (val.length === 64 || val.length === 66) {
      // Assume hex
      if (val.length === 66) {
        if (val.substring(0, 2) === '0x') {
          val = val.slice(2); // Strip hex prefix
        } else {
          error = invalidKeyError;
          return { error, message, valid };
        }
      }

      // Ensure valid hex chars
      for (const c of val) {
        if (hexchars.indexOf(c) === -1) {
          error = invalidHexKeyError;
          return { error, message, valid };
        }
      }

      valid = true;
      message = validKeyMessage;

      return { error, message, valid };
    } else {
      // Attempt to decode to detect errors
      const decoded: DecodeResult = nip19.decode(val);
      console.info(decoded);

      if (decoded.type === 'npub') {
        error = invalidPubKeyError;
        return { error, message, valid };
      }

      if (decoded.type !== 'nsec' || val.length !== 63) {
        error = invalidHexDecodeError;
        return { error, message, valid };
      }
    }
  } catch {
    error = exceptionError;
    return { error, message, valid };
  }

  valid = true;
  message = validKeyMessage;

  return { error, message, valid };
};

export const normalizeKey: any = (val: string) => {
  let hex: any;

  if (val.substring(0, 4) === 'nsec' || val.substring(0, 4) === 'npub') {
    const decoded: DecodeResult = nip19.decode(val);
    hex = decoded.data;
  }

  return hex || val;
};

export const storeNostrPublicKey: any = (privateKey: any) => {
  const normalized: string = normalizeKey(privateKey);
  console.info('Normalized', normalized);

  const pubkey: string = getPublicKey(normalized);

  console.info('PubKey', pubkey);

  localStorage.setItem(nostrPublicKeyStorageKey, pubkey);
};

export const storeNostrPrivateKey: any = (privateKey: any) => {
  localStorage.setItem(nostrPrivateKeyStorageKey, privateKey);

  storeNostrPublicKey(privateKey);
};
