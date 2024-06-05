/* eslint-disable no-unused-vars */
import settings from '@/settings.json';
import { nip19, SimplePool } from 'nostr-tools';
import { SubCloser } from 'nostr-tools/lib/types/abstract-pool';
import {
  finalizeEvent,
  generateSecretKey,
  getEventHash,
  getPublicKey,
  validateEvent,
  VerifiedEvent,
  verifyEvent,
} from 'nostr-tools/pure';
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
const nostrPublicRelays: string[] = settings.nostrPublicRelays;
const nostrPrivateRelays: string[] = settings.nostrPrivateRelays;

export interface NostrProfile {
  npub: string;
  displayName: string;
  picture: string;
  about: string;
  nip05: string;
}

// TODO Need to deprecate this and use something from nostr-tools or match the names
export const emptyNostrProfile: NostrProfile = {
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
      const decoded: nip19.DecodeResult = nip19.decode(val);
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

export const storeNostrKeys: any = (npub: string, nsec: string) => {
  console.info('storeNostrKeys', npub, nsec);

  localStorage.setItem(nostrPublicKeyStorageKey, npub);
  localStorage.setItem(nostrPrivateKeyStorageKey, nsec);
};

const removeNostrPrivateKey: any = () => {
  localStorage.removeItem(nostrPrivateKeyStorageKey);
  localStorage.removeItem(nostrPublicKeyStorageKey);
};

export const getNostrNpubFromStorage: any = () => {
  return localStorage.getItem(nostrPublicKeyStorageKey);
};

export const getNostrNsecFromStorage: any = () => {
  return localStorage.getItem(nostrPrivateKeyStorageKey);
};

export const nostrSignOut: any = () => {
  removeNostrPrivateKey();
};

export const getNostrProfileInfo: any = async (npub: string): Promise<NostrProfile | undefined> => {
  const pubKey: any = nip19.decode(npub);
  const nprofile: any = nip19.nprofileEncode({ pubkey: pubKey.data, relays: nostrPrivateRelays });
  const { type, data } = nip19.decode(nprofile);
  console.info('Data', data);

  if (type !== 'nprofile') {
    throw new Error('Invalid NIP-19 profile response');
  }

  const pool: SimplePool = new SimplePool();

  try {
    const latestProfileEvent: any = await new Promise<any>((resolve: any) => {
      let latestEvent: any = null;

      const sub: SubCloser = pool.subscribeMany(
        nostrPublicRelays,
        [{ kinds: [0], authors: [pubKey.data] }],
        {
          onevent(event: any) {
            if (!latestEvent || latestEvent.created_at < event.created_at) {
              latestEvent = event;
            }
          },
          oneose() {
            sub.close();

            if (!latestEvent) {
              resolve(undefined);
            } else {
              resolve(latestEvent);
            }
          },
        },
      );
    });

    if (!latestProfileEvent) {
      return undefined;
    }

    const json: any = JSON.parse(latestProfileEvent.content);
    console.info('Returned nostrProfile from relay', json);

    const nostrProfile: NostrProfile = {
      npub: npub,
      displayName: json.displayName,
      picture: json.picture,
      about: json.about,
      nip05: json.nip05,
    };

    return nostrProfile;
  } catch (e: any) {
    console.error('Error getting NostrProfileInfo', e);
  }
};

export const generateKeyPair: () => {
  npub: string;
  nsec: string;
} = () => {
  const sk: Uint8Array = generateSecretKey();
  const npub: string = nip19.npubEncode(getPublicKey(sk));
  const nsec: string = nip19.nsecEncode(sk);
  console.info('generateKeyPair()', npub, nsec);

  return { npub, nsec };
};

export const generateProfile: any = async (
  npub: string,
  nsec: string,
): Promise<NostrProfile | undefined> => {
  console.info('generateProfile()', npub, nsec);

  // Create profile
  const profile: NostrProfile = {
    displayName: 'TrueVote User',
    about: 'A TrueVote voter ready to vote!',
    npub: npub,
    picture: '',
    nip05: '',
  };

  // Sign profile
  const verifiedEvent: VerifiedEvent = await signProfile(npub, nsec, profile);
  console.info('generateProfile()->signProfile', verifiedEvent);
  if (verifiedEvent === null) {
    throw 'Could not sign create profile event';
  }

  // Publish the event
  return await publishEvent(verifiedEvent)
    .then(() => {
      return Promise.resolve(profile);
    })
    .catch((e: any) => {
      console.error('generateProfile->publishEvent Error', e);
      throw 'Could not publish profile';
    });
};

const signProfile: any = async (
  npub: string,
  nsec: string,
  profile: NostrProfile,
): Promise<VerifiedEvent | null> => {
  const pubKey: nip19.DecodeResult = nip19.decode(npub);

  // Create a Kind 0 event to create the profile
  const event: any = {
    kind: 0,
    pubkey: pubKey.data,
    created_at: Math.floor(new Date().getTime() / 1000),
    content: JSON.stringify(profile),
    tags: [],
  };
  console.info('Kind 0 Event - Initial', event);

  // Ensure the event is valid for this kind and has all the right properties so far
  const valid: any = validateEvent(event);
  console.info('Valid', valid);
  if (valid === false) {
    return null;
  }

  try {
    const hash: any = getEventHash(event);
    console.info('Hash', hash);
    event.id = hash;
  } catch (e: any) {
    console.error('signProfile->Hash Error', e);
    return null;
  }

  let finalEvent: VerifiedEvent;
  try {
    const privKey: nip19.DecodeResult = nip19.decode(nsec);
    const privKeyArray: Uint8Array = privKey.data as Uint8Array;
    console.info('signProfile keys', nsec, npub, privKey, privKeyArray);
    finalEvent = finalizeEvent(event, privKeyArray);
  } catch (e: any) {
    console.error('finalizeEvent->Signature Error', e);
    return null;
  }

  console.info('Kind 0 Event - Filled', finalEvent);

  // Ensure the event is valid for this kind is still valid after adding additional properties
  const valid2: any = validateEvent(finalEvent);
  console.info('Valid2', valid2);
  if (valid2 === false) {
    return null;
  }

  try {
    const validEvent: boolean = verifyEvent(finalEvent);
    console.info('Valid Event', validEvent);
  } catch {
    console.error('Invalid signature after verification');
    return null;
  }

  console.info('signProfile finally finalEvent', finalEvent);
  return finalEvent;
};

export const publishEvent: any = async (signedEvent: VerifiedEvent): Promise<any> => {
  const pool: SimplePool = new SimplePool();

  try {
    const promises: any = await pool.publish(nostrPublicRelays, signedEvent);
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
  Promise.resolve();
};

export const signEvent: any = async (
  nsec: string,
  npub: string,
  content: string,
  createdAt: string,
): Promise<string> => {
  const privKey: nip19.DecodeResult = nip19.decode(nsec);
  const privKeyArray: Uint8Array = privKey.data as Uint8Array;
  const pubKey: any = getPublicKey(privKeyArray);
  console.info('signEvent keys', nsec, npub, pubKey, privKey, privKeyArray);

  // Create a Kind 1 event for signIn
  const event: any = {
    kind: 1,
    pubkey: pubKey,
    created_at: Number(createdAt),
    content: content,
    tags: [],
  };

  console.info('signEvent->Kind 1 Event', event);

  // Ensure the event is valid for this kind and has all the right properties so far
  const valid: boolean = validateEvent(event);
  console.info('signEvent->Valid', valid);
  if (valid === false) {
    console.error('signEvent->Invalid event');
    return Promise.reject('Invalid event');
  }

  try {
    const hash: any = getEventHash(event);
    console.info('signEvent->Hash', hash);
    event.id = hash;
  } catch (e: any) {
    console.error('signEvent->Hash Error', e);
    return Promise.reject(`Invalid hash: ${e}`);
  }

  let finalEvent: VerifiedEvent;
  try {
    finalEvent = finalizeEvent(event, privKeyArray);
  } catch (e: any) {
    console.error('finalizeEvent->Signature Error', e);
    return Promise.reject(`Invalid signature: ${e}`);
  }

  console.info('signEvent->Kind 1 Event - Filled', finalEvent);

  // Ensure the event is valid for this kind is still valid after adding additional properties
  const valid2: boolean = validateEvent(finalEvent);
  console.info('signEvent->Valid2', valid2);
  if (valid2 === false) {
    console.error('Invalid event after property update');
    return Promise.reject('Invalid event after property update');
  }

  try {
    const validEvent: boolean = verifyEvent(finalEvent);
    console.info('signEvent->Valid Event', validEvent);
  } catch {
    console.error('Invalid signature after verification');
    return Promise.reject('Invalid signature after verification');
  }

  console.info('signEvent->returning', finalEvent.sig, npub);
  return Promise.resolve(finalEvent.sig);
};

export const npubfromnsec: any = (nsec: string): string => {
  const privKey: nip19.DecodeResult = nip19.decode(nsec);
  const privKeyArray: Uint8Array = privKey.data as Uint8Array;
  const pubKey: any = getPublicKey(privKeyArray);
  const npub: string = nip19.npubEncode(pubKey);

  return npub;
};
