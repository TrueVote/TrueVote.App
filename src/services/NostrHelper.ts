import {
  Event,
  SimplePool,
  generatePrivateKey,
  getEventHash,
  getPublicKey,
  getSignature,
  nip19,
  validateEvent,
  verifySignature,
} from 'nostr-tools';
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
  'wss://nostr-relay.truevote.org',
  'wss://nostr.relayable.org',
  'wss://nostr.pjv.me',
  'wss://nostr.lnproxy.org',
  'wss://relay.nostrss.re',
  'wss://relay.damus.io',
];
const nostrPrivateRelays: string[] = ['wss://nostr-relay.truevote.org'];

let _nostrProfile: NostrProfile | null;

export interface NostrProfile {
  publicKey: string;
  privateKey: string;
  npub: string;
  displayName: string;
  picture: string;
  about: string;
  nip05: string;
}

// TODO Need to deprecate this and use something from nostr-tools or match the names
export const emptyNostrProfile: NostrProfile = {
  publicKey: '',
  privateKey: '',
  npub: '',
  displayName: '',
  picture: '',
  about: '',
  nip05: '',
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

export const getNostrPublicKeyFromPrivate: any = (privateKey: any) => {
  const normalized: string = normalizeKey(privateKey);
  console.info('Normalized', normalized);

  const pubkey: string = getPublicKey(normalized);

  return pubkey;
};

const storeNostrPublicKey: any = (privateKey: any) => {
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

const removeNostrPrivateKey: any = () => {
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
  if (_nostrProfile && _nostrProfile.displayName && _nostrProfile.displayName.length > 0) {
    console.info('Retrieving stored nostrProfile');
    return _nostrProfile;
  }
  console.info('getNostrProfileInfo()', publicKey);

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

    const nostrProfile: NostrProfile = {
      publicKey: publicKey,
      privateKey: '',
      npub: nip19.npubEncode(publicKey),
      displayName: json.displayName,
      picture: json.picture,
      about: json.about,
      nip05: json.nip05,
    };

    _nostrProfile = nostrProfile;
    return nostrProfile;
  } finally {
    sub.unsub();
  }
};

export const generateKeyPair: () => {
  privateKey: string;
  publicKey: string;
  npub: string;
  nsec: string;
} = () => {
  const privateKey: string = generatePrivateKey();
  const publicKey: string = getPublicKey(privateKey);
  const npub: string = nip19.npubEncode(publicKey);
  const nsec: string = nip19.nsecEncode(privateKey);

  return { privateKey, publicKey, npub, nsec };
};

export const generateProfile: any = async (
  privateKey: string,
  publicKey: string,
): Promise<NostrProfile | undefined> => {
  const nsec: string = nip19.nsecEncode(privateKey);
  const npub: string = nip19.npubEncode(publicKey);

  console.info('generateProfile()', privateKey, publicKey, nsec, npub);

  // Create profile
  const profile: NostrProfile = {
    displayName: 'TrueVote User',
    about: 'A TrueVote voter ready to vote!',
    publicKey: publicKey,
    privateKey: '',
    npub: npub,
    picture: '',
    nip05: '',
  };

  // Sign profile
  const signedProfile: any = signProfile(privateKey, publicKey, profile);
  if (signedProfile === '') {
    throw 'Could not sign create profile event';
  }

  // Publish the event
  return await publishEvent(signedProfile)
    .then(() => {
      return Promise.resolve(profile);
    })
    .catch((e: any) => {
      console.error('generateProfile->publishEvent Error', e);
      throw 'Could not publish profile';
    });
};

const signProfile: any = (privateKey: string, publicKey: string, profile: NostrProfile): string => {
  // Create a Kind 0 event to create the profile
  const event: any = {
    kind: 0,
    pubkey: publicKey,
    created_at: Math.floor(Date.now() / 1000),
    content: JSON.stringify(profile),
    tags: [],
  };
  console.info('Kind 0 Event - Initial', event);

  // Ensure the event is valid for this kind and has all the right properties so far
  const valid: any = validateEvent(event);
  console.info('Valid', valid);
  if (valid === false) {
    return '';
  }

  try {
    const hash: any = getEventHash(event);
    console.info('Hash', hash);
    event.id = hash;
  } catch {
    return '';
  }

  try {
    const signature: any = getSignature(event, privateKey);
    console.info('Signature', signature);
    event.sig = signature;
  } catch {
    return '';
  }

  console.info('Kind 0 Event - Filled', event);

  // Ensure the event is valid for this kind is still valid after adding additional properties
  const valid2: any = validateEvent(event);
  console.info('Valid2', valid2);
  if (valid2 === false) {
    return '';
  }

  try {
    const validsig: any = verifySignature(event);
    console.info('Valid Sig', validsig);
  } catch {
    return '';
  }

  return event;
};

export const publishEvent: any = async (signedEvent: Event): Promise<any> => {
  const pool: SimplePool = new SimplePool();

  try {
    const promises: any = await pool.publish(nostrPrivateRelays, signedEvent);
    const results: any = await Promise.allSettled(promises);
    for (const result of results) {
      if (result.status === 'rejected') {
        // Handle the error
        console.error('publishEvent()->Error Rejected Promise', result.reason);
        throw result;
      }
    }
    Promise.resolve();
  } catch (error) {
    console.error('publishEvent()->Error catch:', error);
    throw error;
  }
  console.info('publishEvent()->End()');
};
