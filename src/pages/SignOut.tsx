import { emptyUserModel, useGlobalContext } from '@/Global';
import { jwtSignOut } from '@/services/DataClient';
import { emptyNostrProfile, nostrSignOut } from '@/services/NostrHelper';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Button, Container, HoverCard, Space, Stack, Text } from '@mantine/core';
import { FC } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export const SignOut: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { nostrProfile, updateNostrProfile } = useGlobalContext();
  const { updateUserModel } = useGlobalContext();

  const signOutClick: any = (): void => {
    updateNostrProfile(emptyNostrProfile);
    updateUserModel(emptyUserModel);
    nostrSignOut();
    jwtSignOut();
    console.info('Signed out');
    navigate('/profile');
  };

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Sign Out' />
      </Stack>
      {nostrProfile !== null && String(nostrProfile?.npub).length > 0 ? (
        <>
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
          <Text>Click below to sign out.</Text>
          <Space h='md' />
          <Button radius='md' color='green' variant='light' onClick={signOutClick}>
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Space h='md' />
          <Text>Not Signed In</Text>
          <Space h='md' />
          <Text>Click below to for sign in page.</Text>
          <Space h='md' />
          <Button
            radius='md'
            color='green'
            variant='light'
            onClick={(): void => navigate('/signin')}
          >
            Sign In
          </Button>
          <Space h='md' />
          <Text>Click below to force sign out.</Text>
          <Space h='md' />
          <Button radius='md' color='green' variant='light' onClick={signOutClick}>
            Sign Out
          </Button>
        </>
      )}
    </Container>
  );
};
