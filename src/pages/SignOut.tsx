import { useGlobalContext } from '@/Global';
import { emptyNostrProfile, nostrSignOut } from '@/services/NostrHelper';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Button, Container, Space, Stack, Text } from '@mantine/core';
import { FC } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

export const SignOut: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { nostrProfile, updateNostrProfile } = useGlobalContext();

  const signOutClick: any = (): void => {
    console.info('Signing out...');
    updateNostrProfile(emptyNostrProfile);
    nostrSignOut();
    navigate('/profile');
  };

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Sign Out' />
      </Stack>
      {nostrProfile !== null && String(nostrProfile?.publicKey).length > 0 ? (
        <>
          <Space h='md'></Space>
          <Text className={classes.profileText}>
            <b>Signed In Public Key:</b> {nostrProfile?.npub}
          </Text>
          <Space h='md'></Space>
          <Text>Click below to sign out.</Text>
          <Space h='md'></Space>
          <Button radius='md' color='green' variant='light' onClick={signOutClick}>
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Space h='md'></Space>
          <Text>Not Signed In</Text>
          <Space h='md'></Space>
          <Text>Click below to for sign in page.</Text>
          <Space h='md'></Space>
          <Button radius='md' color='green' variant='light' component={Link} to='/signin'>
            Sign In
          </Button>
        </>
      )}
    </Container>
  );
};
