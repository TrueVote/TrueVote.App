/* eslint-disable no-unused-vars */
import {
  getNostrProfileInfo,
  NostrProfile,
  npubfromnsec,
  signEvent,
} from '../src/services/NostrHelper';
import * as settings from '../src/settings.json';
import { BaseUserModel, SecureString, SignInEventModel, SignInResponse } from '../src/TrueVote.Api';
import { NostrKind } from '../src/TrueVote.Api.ManualModels';

export const signInWithNostr: (
  nsec: string,
  handleError: (error: SecureString) => void,
) => Promise<{
  res: SignInResponse | undefined;
}> = async (nsec: string, handleError: (error: SecureString) => void) => {
  try {
    const npub: string = npubfromnsec(nsec);
    console.info(npub, settings);
    const retrievedProfile: NostrProfile = await getNostrProfileInfo(
      npub,
      settings.nostrPublicRelays,
      settings.nostrPrivateRelays,
    );

    if (retrievedProfile && retrievedProfile !== undefined) {
      const dt: number = Math.floor(new Date().getTime() / 1000);
      const content: BaseUserModel = {
        Email: retrievedProfile.nip05,
        FullName: retrievedProfile.displayName,
        NostrPubKey: npub,
      };

      // Sign the event we're going to send to the API
      const signature: string = await signEvent(nsec, npub, JSON.stringify(content), String(dt));

      if (signature === undefined || npub === undefined) {
        handleError({ Value: 'No data returned from signEvent' });
        return { res: undefined };
      }

      // Now that we got the Nostr profile and signed the event, sign into the TrueVote api
      const signInEventModel: SignInEventModel = {
        Kind: NostrKind.ShortTextNote as number,
        CreatedAt: new Date(dt * 1000).toISOString(),
        PubKey: npub,
        Signature: signature,
        Content: JSON.stringify(content),
      };

      try {
        const result: SignInResponse = await DBUserSignIn(signInEventModel);
        return { res: result };
      } catch (e) {
        console.error('Exception calling DBUserSignIn', e);
        handleError(e as SecureString);
        return { res: undefined };
      }
    } else {
      handleError({ Value: 'Could not retrieve nostr profile' });
      return { res: undefined };
    }
  } catch (e) {
    console.error('Exception getting nostrProfileInfo', e);
    handleError({ Value: (e as Error).message });
    return { res: undefined };
  }
};

const DBUserSignIn = async (signInEventModel: SignInEventModel): Promise<SignInResponse> => {
  console.info(signInEventModel);

  return {
    Token: '',
    User: {
      DateCreated: Date.now.toString(),
      DateUpdated: Date.now.toString(),
      UserPreferences: {},
      UserId: '123',
      NostrPubKey: '',
      FullName: '',
      Email: '',
    },
  };
};
