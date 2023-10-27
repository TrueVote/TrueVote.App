import { getNostrPublicKey, nostrSignOut } from '@/services/NostrHelper';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Button, Container, Space, Stack, Text } from '@mantine/core';
import { FC } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

export const SignOut: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const nostrPublicKey: any = getNostrPublicKey();

  const signOutClick: any = (): void => {
    console.info('Signing out...');
    nostrSignOut();
    navigate('/profile');
  };

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Sign Out' />
      </Stack>
      {nostrPublicKey !== null && String(nostrPublicKey).length > 0 ? (
        <>
          <Space h='md'></Space>
          <Text>Signed In Key: {nostrPublicKey}</Text>
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
