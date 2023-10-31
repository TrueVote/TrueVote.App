import { getPublicKey, nip19, SimplePool } from 'nostr-tools';
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
const nostrPublicRelays: string[] = [
  'wss://relay.damus.io',
  'wss://nostr.lnproxy.org',
  'wss://relay.nostrss.re',
];

let _nostrProfile: NostrProfile | null;

export interface NostrProfile {
  publicKey: string;
  npub: string;
  name: string;
  avatar: string;
  bio: string;
  nip05: string;
}

export const emptyNostrProfile: NostrProfile = {
  name: '',
  avatar: '',
  bio: '',
  nip05: '',
  publicKey: '',
  npub: '',
};

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
  const npub: string = nip19.npubEncode(pubkey);
  console.info('PubKey', pubkey, 'Npub', npub);

  localStorage.setItem(nostrPublicKeyStorageKey, pubkey);
};

export const storeNostrPrivateKey: any = (privateKey: any) => {
  localStorage.setItem(nostrPrivateKeyStorageKey, privateKey);

  storeNostrPublicKey(privateKey);
};

export const removeNostrPrivateKey: any = () => {
  localStorage.removeItem(nostrPrivateKeyStorageKey);
  localStorage.removeItem(nostrPublicKeyStorageKey);
};

export const getNostrPublicKey: any = () => {
  return localStorage.getItem(nostrPublicKeyStorageKey);
};

export const nostrSignOut: any = () => {
  removeNostrPrivateKey();
  _nostrProfile = null;
};

export const getNostrProfileInfo: any = async (
  publicKey: string,
): Promise<NostrProfile | undefined> => {
  // Optimization. If the nostrProfile is alerady set, why go out and fetch it from a relay.
  if (_nostrProfile && _nostrProfile.name && _nostrProfile.name.length > 0) {
    console.info('Retrieving stored nostrProfile');
    return _nostrProfile;
  }

  const nprofile: any = nip19.nprofileEncode({ pubkey: publicKey, relays: nostrPublicRelays });
  const { type, data } = nip19.decode(nprofile);
  console.info('Data', data);

  if (type !== 'nprofile') {
    throw new Error('Invalid NIP-19 profile response');
  }

  const pool: SimplePool = new SimplePool();
  const sub: any = pool.sub(nostrPublicRelays, [{ kinds: [0], authors: [publicKey] }]);

  try {
    const latestProfileEvent: any = await new Promise<any>((resolve: any) => {
      let latestEvent: any = null;

      sub.on('event', (event: any) => {
        if (!latestEvent || latestEvent.created_at < event.created_at) {
          latestEvent = event;
        }
      });

      sub.on('eose', () => {
        sub.unsub();

        if (!latestEvent) {
          resolve(undefined);
        } else {
          resolve(latestEvent);
        }
      });
    });

    if (!latestProfileEvent) {
      return undefined;
    }

    const json: any = JSON.parse(latestProfileEvent.content);
    console.info('Returned from relay', json);

    const userProfile: NostrProfile = {
      name: json.displayName,
      avatar: json.picture,
      bio: json.about,
      publicKey: publicKey,
      nip05: json.nip05,
      npub: nip19.npubEncode(publicKey),
    };

    _nostrProfile = userProfile;
    return userProfile;
  } finally {
    sub.unsub();
  }
};
