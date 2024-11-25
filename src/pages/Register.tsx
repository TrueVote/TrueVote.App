import { useGlobalContext } from '@/Global';
import {
  emptyNostrProfile,
  generateKeyPair,
  generateProfile,
  NostrProfile,
  nostrSignOut,
  storeNostrKeys,
} from '@/services/NostrHelper';
import { jwtSignOut, storeJwt } from '@/services/RESTDataClient';
import * as settings from '@/settings.json';
import { SecureString } from '@/TrueVote.Api';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { ErrorModal } from '@/ui/ErrorModal';
import { Hero } from '@/ui/Hero';
import { NpubView } from '@/ui/NpubView';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Container,
  List,
  MantineTheme,
  rem,
  Slider,
  Space,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import {
  IconCheck,
  IconClipboardCheck,
  IconClipboardCopy,
  IconFileDownload,
  IconLogout,
} from '@tabler/icons-react';
import { jsPDF } from 'jspdf';
import { FC, useState } from 'react';
import { Link, NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { signInWithNostr } from './SignIn';

export const Register: FC = () => {
  const theme: MantineTheme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const getColor = (color: string): string => theme.colors[color][colorScheme === 'dark' ? 5 : 7];
  const navigate: NavigateFunction = useNavigate();
  const { nostrProfile, updateNostrProfile } = useGlobalContext();
  const { updateUserModel } = useGlobalContext();
  const [npub, updateNpub] = useState<string | null>(null);
  const [nsec, updateNsec] = useState<string | null>(null);
  const [nsecCheckbox, updateNsecCheckbox] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const clipboard: any = useClipboard({ timeout: 500 });
  const location = useLocation();
  const [copyChecked, setCopyChecked] = useState<boolean>(false);
  const [understandChecked, setUnderstandChecked] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState(false);
  const isSafariOniOS =
    /iPhone|iPad|iPod/i.test(navigator.userAgent) &&
    /WebKit/i.test(navigator.userAgent) &&
    !/(CriOS|FxiOS|OPiOS|mercury)/i.test(navigator.userAgent);

  const errorModal: any = (e: any) => {
    setErrorMessage(String(e));
    setOpened((v: any) => !v);
  };

  const handleError: any = (e: SecureString): void => {
    console.error('Error from signIn', e);
    setLoading((v: boolean) => !v);
    errorModal(e.Value);
    updateNostrProfile(emptyNostrProfile);
    nostrSignOut();
    jwtSignOut();
  };

  const createProfile: any = async () => {
    setLoading(true);

    generateProfile(npub, nsec, settings.nostrPrivateRelays)
      .then(async (newProfile: NostrProfile) => {
        console.info('New Profile Returned back to Register', newProfile);
        if (nsec !== null) {
          const { retrievedProfile, npub, res } = await signInWithNostr(nsec, handleError);
          if (res) {
            console.info('Success from generateProfile->signIn', res);
            updateNostrProfile(retrievedProfile);
            updateUserModel(res.User);
            storeNostrKeys(npub, nsec);
            storeJwt(res.Token);
            const from = location.state?.from?.pathname || '/elections';
            console.info(
              'Profile generated and SignedIn. Navigating to location history stack',
              location,
              from,
            );
            setLoading(false);
            navigate(from, { replace: true });
          }
        }
        setLoading(false);
      })
      .catch((e: any) => {
        console.error('Caught Error generating nostr profile:', e);
        updateNostrProfile(emptyNostrProfile);
        nostrSignOut();
        jwtSignOut();
        setLoading(false);
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

  const saveToPDF = (): void => {
    const doc = new jsPDF();
    const filename = 'truevote-key-backup.pdf';

    // Add TrueVote branding/header
    doc.setFontSize(20);
    doc.text('TrueVote Key Backup', 20, 20);

    // Add warning
    doc.setFontSize(12);
    doc.text('IMPORTANT: Store this PDF in a secure location', 20, 40);

    // Add keys
    doc.text('Public Key (npub):', 20, 60);
    doc.text(npub!, 20, 70, { maxWidth: 170 });

    doc.text('Private Key (nsec):', 20, 90);
    doc.text(nsec!, 20, 100, { maxWidth: 170 });

    if (isSafariOniOS) {
      modals.open({
        title: 'Save Your Key Backup',
        centered: true,
        size: 'lg',
        children: (
          <Stack>
            <Text>After tapping the button below:</Text>
            <List>
              <List.Item>The PDF will open in a new tab</List.Item>
              <List.Item>Tap the Share icon</List.Item>
              <List.Item>Select &quot;Save to Files&quot;</List.Item>
              <List.Item>Choose a secure location</List.Item>
              <List.Item>Tap &quot;Save&quot;</List.Item>
              <List.Item>
                Note: The file will be named &quot;unknown.pdf&quot; - you can rename it after
                saving
              </List.Item>
            </List>
            <Button
              onClick={() => {
                const pdfBlob = doc.output('blob');
                const blobUrl = URL.createObjectURL(
                  new Blob([pdfBlob], { type: 'application/pdf' }),
                );
                window.open(blobUrl, '_blank');
                modals.closeAll();
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
              }}
              fullWidth
              size='lg'
              mt='md'
            >
              Open PDF
            </Button>
          </Stack>
        ),
        withCloseButton: true,
      });
    } else {
      doc.save(filename);
    }
  };

  if (loading) {
    return <TrueVoteLoader />;
  }

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Register' />
      </Stack>
      <ErrorModal
        visible={opened}
        onClose={(): void => setOpened(false)}
        text={errorMessage}
        title='Register Error'
      />
      {nostrProfile !== null &&
      nostrProfile !== undefined &&
      String(nostrProfile?.npub).length > 0 ? (
        <>
          <Text>Already Signed In</Text>
          <NpubView npub={nostrProfile.npub} />
          <Text>Click below for sign out page.</Text>
          <Space h='md' />
          <Button
            leftSection={<IconLogout />}
            className={`${classes.primaryPurpleBackgroundColor}`}
            radius='md'
            variant='filled'
            onClick={(): void => {
              navigate('/signout');
            }}
            styles={{
              root: {
                color: 'white',
              },
            }}
          >
            Sign Out
          </Button>
        </>
      ) : npub !== null && nsec !== null ? (
        <>
          <Text size='l' mt='xs' className='text-wrap'>
            TrueVote uses public / private key pairs for login. It&apos;s the same authentication
            method used for nostr, a nascent decentralized network. This is a new way to login on
            the Internet and different from what most people are used to.
            <br />
            <br />
            Storing your keys on your device is the only way to access your account. Your key
            information below is vital for you to keep safe.
          </Text>
          <Space h='md' />
          <Text size='l' mb='xs' c={getColor('yellow')}>
            ⚠️ Important: Your private key is your only way to access your account. Store it
            somewhere safe - if you lose it, there&apos;s no way to recover your account.
          </Text>
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
            <span
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
            </span>
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
            <span
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
                  onClick={(): void => {
                    clipboard.copy(nsec);
                    setHasCopied(true); // Set our permanent state
                  }}
                  aria-label='Copy'
                  variant='transparent'
                  className={hasCopied || nsecCheckbox ? '' : classes.pulseIcon} // Use our state instead
                  style={{ marginLeft: 8 }}
                >
                  {hasCopied ? ( // Use our state here too
                    <IconClipboardCheck size={24} />
                  ) : nsecCheckbox ? (
                    <IconCheck size={24} color='green' />
                  ) : (
                    <IconClipboardCopy size={24} />
                  )}
                </ActionIcon>{' '}
              </div>
            </span>
          </Box>
          <Box px='md'>
            <Button
              leftSection={<IconFileDownload size={24} />}
              variant='light'
              color='blue'
              fullWidth
              h={60}
              size='xl'
              onClick={saveToPDF}
              styles={{
                label: {
                  fontSize: 24, // Slightly smaller than Generate Profile button
                },
              }}
            >
              {isSafariOniOS ? 'Save Key Backup (Share → Save to Files)' : 'Save Key Backup PDF'}
            </Button>
            <Space h='md' />{' '}
            <Box
              style={{
                color: 'rgb(255, 59, 48)',
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <Checkbox
                checked={copyChecked}
                onChange={(event) => setCopyChecked(event.currentTarget.checked)}
                style={{ marginRight: '8px' }}
              />
              <span style={{ marginRight: '8px' }}>🔑</span>
              <Text>I have copied/saved my Nsec (Private) Key and stored it somewhere safe.</Text>
            </Box>
            <Box style={{ color: 'rgb(255, 59, 48)', display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={understandChecked}
                onChange={(event) => setUnderstandChecked(event.currentTarget.checked)}
                style={{ marginRight: '8px' }}
              />
              <span style={{ marginRight: '8px' }}>🔑</span>
              <Text>
                I understand that if I lose my Nsec (Private) Key I will lose access to my user
                account.
              </Text>
            </Box>{' '}
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
            disabled={!nsecCheckbox || !copyChecked || !understandChecked}
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
          <Text>If you do not have a nostr key, click below to generate one.</Text>
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
