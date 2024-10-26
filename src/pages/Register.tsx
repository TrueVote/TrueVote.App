import { useGlobalContext } from '@/Global';
import {
  emptyNostrProfile,
  generateKeyPair,
  generateProfile,
  NostrProfile,
  nostrSignOut,
  storeNostrKeys,
} from '@/services/NostrHelper';
import { jwtSignOut } from '@/services/RESTDataClient';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  ActionIcon,
  Box,
  Button,
  Container,
  HoverCard,
  Modal,
  rem,
  Slider,
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
  const [npub, updateNpub] = useState<string | null>(null);
  const [nsec, updateNsec] = useState<string | null>(null);
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

    generateProfile(npub, nsec)
      .then((newProfile: NostrProfile) => {
        console.info('New Profile Returned back to Register', newProfile);
        setVisible((v: any) => !v);
        updateNostrProfile(newProfile);
        storeNostrKeys(npub, nsec);
        navigate('/profile');
      })
      .catch((e: any) => {
        console.error('Caught Error generating nostr profile:', e);
        updateNostrProfile(emptyNostrProfile);
        nostrSignOut();
        jwtSignOut();
        setVisible((v: any) => !v);
        errorModal(e);
      });
  };

  const getKeyPair: any = () => {
    const { npub, nsec } = generateKeyPair();

    updateNpub(npub);
    updateNsec(nsec);
  };

  const signInElements: React.ReactNode = (
    <>
      <Space h='md' />
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
      {nostrProfile !== null && String(nostrProfile?.npub).length > 0 ? (
        <>
          <Text>Already Signed In</Text>
          <Space h='md' />
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
      ) : npub !== null && nsec !== null ? (
        <>
          <Text size='l' mt='xs' className='text-wrap'>
            TrueVote uses public / private key pairs for login. It&apos;s the same authentication
            method used for NOSTR, a nascent decentralized social network. This is a new way to
            login on the Internet and different to what most people are used to.
            <br />
            <br />
            Storing your keys on your device is the only way to access your account. Your key
            information below is vital for you to keep safe.
          </Text>
          <Space h='md' />
          <Text size='l' mb='xs' style={{ color: '#FFD700' }}>
            ⚠️ Important: Your private key is your only way to access your account. Store it
            somewhere safe - if you lose it, there&apos;s no way to recover your account.
          </Text>{' '}
          <Space h='md' />
          <Box
            p='md'
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '1rem',
              width: '100%', // Ensure full width
            }}
          >
            <Text
              className={classes.profileText}
              style={{
                wordBreak: 'break-all',
                maxWidth: '100%',
                fontSize: '1.1rem',
              }}
            >
              <Text fw={700} size='lg' mb={5}>
                Npub (Public) Key:
              </Text>
              <Text
                style={{
                  background: 'rgba(0, 255, 0, 0.05)',
                  padding: '10px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  width: '100%', // Ensure full width
                }}
              >
                {npub}
              </Text>
            </Text>
          </Box>
          <Box
            p='md'
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '1rem',
              width: '100%', // Ensure full width
            }}
          >
            <Text
              className={classes.profileText}
              style={{
                wordBreak: 'break-all',
                maxWidth: '100%',
                fontSize: '1.1rem',
              }}
            >
              <Text fw={700} size='lg' mb={5}>
                Nsec (Private) Key:
              </Text>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%', // Ensure full width
                  background: 'rgba(255, 0, 0, 0.05)',
                  padding: '10px',
                  borderRadius: '4px',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'monospace',
                    flex: 1, // Take up remaining space
                    marginRight: '8px', // Space between text and icon
                  }}
                >
                  {nsec}
                </Text>
                <ActionIcon
                  onClick={(): void => clipboard.copy(nsec)}
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
              </div>
            </Text>
          </Box>{' '}
          <Box px='md'>
            <Text
              style={{
                color: 'rgb(255, 59, 48)',
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '12px',
              }}
            >
              <span style={{ marginRight: '8px' }}>🔑</span>
              <span>I have copied my Nsec (Private) Key and stored it somewhere safe.</span>
            </Text>
            <Text style={{ color: 'rgb(255, 59, 48)', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '8px' }}>🔑</span>
              <span>
                I understand that if I lose my Nsec (Private) Key I will lose access to my user
                account.
              </span>
            </Text>{' '}
            <Space h='md' />
            <Slider
              size='xl'
              color='green'
              thumbSize={24}
              styles={{
                thumb: { borderWidth: rem(2), padding: rem(3) },
                markLabel: {
                  color: 'green',
                  fontSize: '1.2rem',
                  marginTop: '10px',
                  whiteSpace: 'nowrap',
                  transform: 'translateX(0)', // This removes default offset
                  textAlign: 'left', // Align text to the left
                },
                mark: {
                  transform: 'translateX(0)', // Align mark with the start
                },
                trackContainer: { backgroundColor: 'green' },
              }}
              marks={[
                { value: 0, label: 'Swipe to confirm →' },
                { value: 100, label: '🔑' },
              ]}
              onChangeEnd={(value) => {
                if (value === 100) {
                  updateNsecCheckbox(true);
                } else {
                  updateNsecCheckbox(false);
                }
              }}
            />
            <Space h='md' />
          </Box>
          <Space h='md' />
          <Space h='md' />
          <Button
            radius='md'
            color='green'
            variant='light'
            fullWidth
            h={60}
            size='xl'
            disabled={!nsecCheckbox}
            onClick={createProfile}
            styles={{
              label: {
                fontSize: 36,
              },
            }}
          >
            Generate Profile
          </Button>
          <Text
            size='sm'
            style={{
              color: '#888',
              marginTop: '20px',
              padding: '10px',
              borderLeft: '3px solid #444',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            NOTE: Your submitted ballot(s) are safe and will be counted even if you lose your key.
            The key only affects your ability to log in to your account.
          </Text>
          {signInElements}
        </>
      ) : (
        <>
          <Text>If you do not have a nostr key, click below to generate one</Text>
          <Space h='md' />
          <Button
            radius='md'
            color='green'
            variant='light'
            fullWidth
            h={60}
            size='xl'
            styles={{
              label: {
                fontSize: 36,
              },
            }}
            onClick={getKeyPair}
          >
            Generate Key
          </Button>
          {signInElements}
        </>
      )}
    </Container>
  );
};
