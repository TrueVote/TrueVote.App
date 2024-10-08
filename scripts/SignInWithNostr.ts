/* eslint-disable no-unused-vars */
import { npubfromnsec, signEvent } from '../src/services/NostrHelper';
import { BaseUserModel, SecureString, SignInEventModel } from '../src/TrueVote.Api';
import { NostrKind } from '../src/TrueVote.Api.ManualModels';

export const signInWithNostr: (
  nsec: string,
  handleError: (error: SecureString) => void,
) => Promise<SignInEventModel | undefined> = async (
  nsec: string,
  handleError: (error: SecureString) => void,
) => {
  try {
    const npub: string = npubfromnsec(nsec);
    console.info(npub);

    const dt: number = Math.floor(new Date().getTime() / 1000);
    const content: BaseUserModel = {
      Email: '',
      FullName: '',
      NostrPubKey: npub,
    };

    // Sign the event we're going to send to the API
    const signature: string = await signEvent(nsec, npub, JSON.stringify(content), String(dt));

    if (signature === undefined || npub === undefined) {
      handleError({ Value: 'No data returned from signEvent' });
      return undefined;
    }

    // Now that we got the Nostr profile and signed the event, sign into the TrueVote api
    const signInEventModel: SignInEventModel = {
      Kind: NostrKind.ShortTextNote as number,
      CreatedAt: new Date(dt * 1000).toISOString(),
      PubKey: npub,
      Signature: signature,
      Content: JSON.stringify(content),
    };

    return signInEventModel;
  } catch (e) {
    console.error('Exception signing Nostr profile', e);
    handleError({ Value: (e as Error).message });
    return undefined;
  }
};
