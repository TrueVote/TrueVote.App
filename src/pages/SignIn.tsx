import { emptyUserModel, useGlobalContext } from '@/Global';
import {
  emptyNostrProfile,
  getNostrProfileInfo,
  nostrKeyKeyHandler,
  NostrProfile,
  nostrSignOut,
  npubfromnsec,
  signEvent,
  storeNostrKeys,
} from '@/services/NostrHelper';
import { DBUserSignIn, jwtSignOut, storeJwt } from '@/services/RESTDataClient';
import * as settings from '@/settings.json';
import { BaseUserModel, SecureString, SignInEventModel, SignInResponse } from '@/TrueVote.Api';
import { NostrKind } from '@/TrueVote.Api.ManualModels';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  Button,
  Container,
  HoverCard,
  Modal,
  PasswordInput,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { Link, NavigateFunction, useLocation, useNavigate } from 'react-router-dom';

export const SignIn: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { nostrProfile, updateNostrProfile } = useGlobalContext();
  const { userModel, updateUserModel } = useGlobalContext();
  const { updateAccessCodes } = useGlobalContext();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [valid, setValid] = useState(false);
  const [nsec, setNsec] = useState('');
  const [visible, setVisible] = useState(false);
  const [opened, setOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();

  const errorModal: any = (e: any) => {
    setErrorMessage(String(e));
    setOpened((v: any) => !v);
  };

  const handleChange: any = (e: any): void => {
    const inputValue: string = e.target.value;
    const { error, message, valid } = nostrKeyKeyHandler(e);

    setError(error);
    setMessage(message);
    setValid(valid);
    setNsec(inputValue);
  };

  const handleError: any = (e: SecureString): void => {
    console.error('Error from signIn', e);
    setVisible((v: boolean) => !v);
    errorModal(e.Value);
    updateNostrProfile(emptyNostrProfile);
    nostrSignOut();
    jwtSignOut();
  };

  const signInClick: any = async () => {
    updateAccessCodes([]);
    setVisible((v: any) => !v);

    console.info('Nostr Key:', nsec);

    const { retrievedProfile, npub, res } = await signInWithNostr(nsec, handleError);
    if (res) {
      console.info('Success from signIn', res);
      updateNostrProfile(retrievedProfile);
      updateUserModel(res.User);
      storeNostrKeys(npub, nsec);
      storeJwt(res.Token);
      setVisible((v: boolean) => !v);
      // navigate('/profile');
    }
  };

  useEffect(() => {
    if (userModel !== emptyUserModel) {
      const from = location.state?.from?.pathname || '/profile';
      console.info('SignedIn. Navigating to location history stack', userModel, location, from);
      navigate(from, { replace: true });
    }
  }, [userModel, location, navigate]);

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Sign In' />
      </Stack>
      <TrueVoteLoader visible={visible} />
      <Modal
        centered
        withCloseButton={true}
        title='Sign In Error'
        onClose={(): void => setOpened(false)}
        opened={opened}
      >
        <Text>Error: {errorMessage}</Text>
      </Modal>
      {nostrProfile === null || String(nostrProfile?.npub).length === 0 ? (
        <>
          <Text>
            To sign in, please provide your nostr secret (nsec1) key. If you would like to create a
            new identity, go to the{' '}
            <Link to='/register' className={classes.linkActive}>
              {' '}
              sign up page
            </Link>
            .
          </Text>
          <Space h='md' />
          <PasswordInput
            description='Your secret key'
            placeholder='Nostr nsec1 key'
            onChange={handleChange}
          />
          <Space h='xl'>
            <Text c='red'>{error}</Text>
            <Text c='green'>{message}</Text>
          </Space>
          <Button radius='md' color='green' variant='light' disabled={!valid} onClick={signInClick}>
            Sign In
          </Button>
        </>
      ) : (
        <>
          <Space h='md' />
          <Text className={classes.textAlert}>Already Signed In</Text>
          <Space h='md' />
          <Text className={classes.profileText}>
            <b>Signed In Public Key:</b>
            <HoverCard shadow='md'>
              <HoverCard.Target>
                <span className={classes.textChopped}>{nostrProfile?.npub}</span>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text size='sm'>{nostrProfile?.npub}</Text>
              </HoverCard.Dropdown>
            </HoverCard>
          </Text>
          <Space h='md' />
          <Text>Click below for sign out page.</Text>
          <Space h='md' />
          <Button
            radius='md'
            color='green'
            variant='light'
            onClick={(): void => navigate('/signout')}
          >
            Sign Out
          </Button>
        </>
      )}
    </Container>
  );
};

/* eslint-disable no-unused-vars */
export const signInWithNostr: (
  nsec: string,
  handleError: (error: SecureString) => void,
) => Promise<{
  retrievedProfile: NostrProfile;
  npub: string;
  res: SignInResponse | undefined;
}> = async (nsec: string, handleError: (error: SecureString) => void) => {
  try {
    const npub: string = npubfromnsec(nsec);
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
        return { retrievedProfile, npub, res: undefined };
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
        const res: SignInResponse = await DBUserSignIn(signInEventModel);
        return { retrievedProfile, npub, res };
      } catch (e) {
        console.error('Exception calling DBUserSignIn', e);
        handleError(e as SecureString);
        return { retrievedProfile: undefined!, npub: '', res: undefined };
      }
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
