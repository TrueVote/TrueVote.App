import { SecureString, SignInEventModel } from '@/TrueVote.Api';
import { NostrKind } from '@/TrueVote.Api.ManualModels';
import { DBUserSignIn } from './DataClient';
import { NostrProfile, getNostrProfileInfo, npubfromnsec, signEvent } from './NostrHelper';

export const signInWithNostr: (
  nsec: string,
  handleError: (error: SecureString) => void,
) => Promise<{
  retrievedProfile: NostrProfile;
  npub: string;
  res: SecureString | undefined;
}> = async (nsec, handleError) => {
  try {
    const npub: string = npubfromnsec(nsec);
    const retrievedProfile: NostrProfile = await getNostrProfileInfo(npub);

    if (retrievedProfile && retrievedProfile !== undefined) {
      const dt: number = Math.floor(new Date().getTime() / 1000);
      const content: string = 'SIGNIN';

      // Sign the event we're going to send to the API
      const signature: string = await signEvent(nsec, npub, content, String(dt));

      if (signature === undefined || npub === undefined) {
        handleError({ Value: 'No data returned from signEvent' });
        return { retrievedProfile, npub, res: undefined };
      }

      // Now that we got the Nostr profile and signed the event, sign into the TrueVote api
      const signInEventModel: SignInEventModel = {
        Kind: NostrKind.ShortTextNote as number,
        CreatedAt: new Date(dt * 1000).toISOString(),
        PubKey: npub,
        Signature: signature,
        Content: 'SIGNIN',
      };

      const res: SecureString = await DBUserSignIn(signInEventModel);
      return { retrievedProfile, npub, res };
    } else {
      handleError({ Value: 'Could not retrieve nostr profile' });
      return { retrievedProfile: undefined!, npub: '', res: undefined };
    }
  } catch (e) {
    console.error('Exception getting nostrProfileInfo', e);
    handleError({ Value: (e as Error).message });
    return { retrievedProfile: undefined!, npub: '', res: undefined };
  }
};
