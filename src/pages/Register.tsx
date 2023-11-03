import { useGlobalContext } from '@/Global';
import { generateKeyPair, generateProfile } from '@/services/NostrHelper';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Button, Container, Space, Stack, Text } from '@mantine/core';
import { FC, useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { nostrProfile, updateNostrProfile } = useGlobalContext();
  const [nostrPublicKey, updatePublicKey] = useState<string | null>(null);
  const [nostrPrivateKey, updatePrivateKey] = useState<string | null>(null);

  const createProfile: any = () => {
    generateProfile();
  };

  const getKeyPair: any = () => {
    const { privateKey, publicKey } = generateKeyPair();

    updatePublicKey(publicKey);
    updatePrivateKey(privateKey);
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
      {nostrProfile !== null && String(nostrProfile?.publicKey).length > 0 ? (
        <>
          <Space h='md'></Space>
          <Text>Already Signed In</Text>
          <Space h='md'></Space>
          <Text className={classes.profileText}>
            <b>Signed In Public Key:</b>{' '}
            <span className={classes.textChopped}>{nostrProfile?.npub}</span>
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
      ) : nostrPublicKey !== null ? (
        <>
          <Text className={classes.profileText}>
            <b>Public Key:</b> {nostrPublicKey}
          </Text>
          <Text className={classes.profileText}>
            <b>Private Key:</b> {nostrPrivateKey}
          </Text>
          <Space h='md'></Space>
          <Text>Copy this key. |WRITE LANGUAGE TO CHECK A BOX AND CONFIRM COPY|</Text>
          <Space h='md'></Space>
          <Button radius='md' color='green' variant='light' onClick={createProfile}>
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
