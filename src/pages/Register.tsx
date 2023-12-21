import { useGlobalContext } from '@/Global';
import {
  NostrProfile,
  emptyNostrProfile,
  generateKeyPair,
  generateProfile,
  nostrSignOut,
  storeNostrPrivateKey,
} from '@/services/NostrHelper';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  ActionIcon,
  Button,
  Checkbox,
  Container,
  HoverCard,
  Modal,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCheck, IconClipboardCheck, IconClipboardCopy } from '@tabler/icons-react';
import { FC, useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { nostrProfile, updateNostrProfile } = useGlobalContext();
  const [nostrPublicKey, updatePublicKey] = useState<string | null>(null);
  const [nostrPrivateKey, updatePrivateKey] = useState<string | null>(null);
  const [nostrNpub, updateNpub] = useState<string | null>(null);
  const [nostrNsec, updateNsec] = useState<string | null>(null);
  const [nsecCheckbox, updateNsecCheckbox] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const [opened, setOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const clipboard: any = useClipboard({ timeout: 500 });

  const errorModal: any = (e: any) => {
    setErrorMessage(String(e));
    setOpened((v: any) => !v);
  };

  const createProfile: any = () => {
    setVisible((v: any) => !v);

    generateProfile(nostrPrivateKey, nostrPublicKey)
      .then((newProfile: NostrProfile) => {
        console.info('New Profile Returned back to Register', newProfile);
        setVisible((v: any) => !v);
        updateNostrProfile(newProfile);
        storeNostrPrivateKey(nostrPrivateKey);
        navigate('/profile');
      })
      .catch((e: any) => {
        console.error('Caught Error generating nostr profile:', e);
        updateNostrProfile(emptyNostrProfile);
        nostrSignOut();
        setVisible((v: any) => !v);
        errorModal(e);
      });
  };

  const getKeyPair: any = () => {
    const { privateKey, publicKey, npub, nsec } = generateKeyPair();

    updatePublicKey(publicKey);
    updatePrivateKey(privateKey);
    updateNpub(npub);
    updateNsec(nsec);
  };

  const signInElements: React.ReactNode = (
    <>
      <Space h='md'></Space>
      <Text>
        If you already have a nostr key,{' '}
        <Link to='/signin' className={classes.linkActive}>
          sign in
        </Link>
        .
      </Text>
    </>
  );

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Register' />
      </Stack>
      <TrueVoteLoader visible={visible} />
      <Modal
        centered
        withCloseButton={true}
        title='Register Error'
        onClose={(): void => setOpened(false)}
        opened={opened}
      >
        <Text>Error: {errorMessage}</Text>
      </Modal>
      {nostrProfile !== null && String(nostrProfile?.publicKey).length > 0 ? (
        <>
          <Space h='md'></Space>
          <Text>Already Signed In</Text>
          <Space h='md'></Space>
          <Text className={classes.profileText}>
            <b>Signed In Public Key:</b>{' '}
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
      ) : nostrPublicKey !== null && nostrPrivateKey !== null ? (
        <>
          <Space h='md'></Space>
          <Text className={classes.profileText}>
            <b>Npub (Public) Key:</b> {nostrNpub}
          </Text>
          <Text className={classes.profileText}>
            <b>Nsec (Private) Key:</b> {nostrNsec}{' '}
            <ActionIcon
              onClick={(): void => clipboard.copy(nostrNsec)}
              aria-label='Copy'
              variant='transparent'
            >
              {clipboard.copied ? (
                <IconClipboardCheck size={24} />
              ) : nsecCheckbox ? (
                <IconCheck size={24} color='green' />
              ) : (
                <IconClipboardCopy size={24} />
              )}
            </ActionIcon>
          </Text>
          <Space h='md'></Space>
          <Checkbox
            checked={nsecCheckbox}
            onChange={(event: any): void => updateNsecCheckbox(event.currentTarget.checked)}
            label='I have copied my private Nsec key and stored it somewhere safe. I understand that if I lose this key I will lose access to my user account.'
          ></Checkbox>
          <Space h='md'></Space>
          <Button
            radius='md'
            color='green'
            variant='light'
            disabled={!nsecCheckbox}
            onClick={createProfile}
          >
            Generate Profile
          </Button>
          {signInElements}
        </>
      ) : (
        <>
          <Text>If you do not have a nostr key, click below to generate one</Text>
          <Space h='md'></Space>
          <Button radius='md' color='green' variant='light' onClick={getKeyPair}>
            Generate Key
          </Button>
          {signInElements}
        </>
      )}
    </Container>
  );
};
