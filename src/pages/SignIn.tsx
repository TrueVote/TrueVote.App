import { useGlobalContext } from '@/Global';
import { SecureString, SignInEventModel } from '@/TrueVote.Api';
import { NostrKind } from '@/TrueVote.Api.ManualModels';
import { DBUserSignIn } from '@/services/DataClient';
import {
  NostrProfile,
  emptyNostrProfile,
  getNostrProfileInfo,
  getNostrPublicKeyFromPrivate,
  getNpub,
  nostrKeyKeyHandler,
  nostrSignOut,
  signEvent,
  storeNostrPrivateKey,
} from '@/services/NostrHelper';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  Button,
  Container,
  HoverCard,
  Image,
  Modal,
  PasswordInput,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { FC, useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

export const SignIn: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { nostrProfile, updateNostrProfile } = useGlobalContext();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [valid, setValid] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [visible, setVisible] = useState(false);
  const [opened, setOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    setPrivateKey(inputValue);
  };

  const handleError: any = (e: SecureString): void => {
    console.error('Error from signIn', e);
    setVisible((v: boolean) => !v);
    errorModal(e.Value);
    updateNostrProfile(emptyNostrProfile);
    nostrSignOut();
  };

  const signInClick: any = async () => {
    setVisible((v: any) => !v);

    console.info('Nostr Key:', privateKey);
    const publicKey: any = getNostrPublicKeyFromPrivate(privateKey);
    const npub: any = getNpub(publicKey);

    try {
      const retreivedProfile: NostrProfile = await getNostrProfileInfo(publicKey);
      console.info('Returned Back', retreivedProfile);

      if (retreivedProfile && retreivedProfile !== undefined) {
        const dt: number = Math.floor(new Date().getTime() / 1000);

        // Now that we got the Nostr profile, sign into the TrueVote api
        const signInEventModel: SignInEventModel = {
          Kind: NostrKind.ShortTextNote,
          CreatedAt: String(dt),
          PubKey: publicKey,
          Signature: '',
          Content: 'SIGNIN',
        };

        // Sign the model
        const signature: string = await signEvent(signInEventModel, privateKey);
        console.info('Success from signEvent', signature);
        signInEventModel.Signature = signature;
        signInEventModel.PubKey = npub;
        signInEventModel.CreatedAt = new Date(dt * 1000).toISOString();

        const res: SecureString = await DBUserSignIn(signInEventModel);
        console.info('Success from signIn', res);
        updateNostrProfile(retreivedProfile);
        storeNostrPrivateKey(privateKey);
        setVisible((v: boolean) => !v);
        navigate('/profile');
      } else {
        handleError({ Value: 'Could not retreive nostr profile' });
      }
    } catch (e) {
      handleError(e);
    }
  };

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
      {nostrProfile === null || String(nostrProfile?.publicKey).length === 0 ? (
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
          <Space h='md'></Space>
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
          <Space h='md'></Space>
          <Text>
            Or, sign in with a browser extension, such as{' '}
            <Link to='https://getalby.com' className={classes.linkActive}>
              Alby
            </Link>
            .
            <Image className={classes.albyImage} component={Link} to='https://getalby.com' />
          </Text>
        </>
      ) : (
        <>
          <Space h='md'></Space>
          <Text className={classes.textAlert}>Already Signed In</Text>
          <Space h='md'></Space>
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
          <Space h='md'></Space>
          <Text>Click below for sign out page.</Text>
          <Space h='md'></Space>
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
