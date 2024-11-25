import { emptyUserModel, useGlobalContext } from '@/Global';
import { emptyNostrProfile, nostrSignOut } from '@/services/NostrHelper';
import { jwtSignOut } from '@/services/RESTDataClient';
import { Hero } from '@/ui/Hero';
import { NpubView } from '@/ui/NpubView';
import classes from '@/ui/shell/AppStyles.module.css';
import { Button, Container, Space, Stack, Text } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { FC } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export const SignOut: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { nostrProfile, updateNostrProfile } = useGlobalContext();
  const { updateUserModel } = useGlobalContext();
  const { updateAccessCodes } = useGlobalContext();

  const signOutClick: any = (): void => {
    updateNostrProfile(emptyNostrProfile);
    updateUserModel(emptyUserModel);
    updateAccessCodes([]);
    nostrSignOut();
    jwtSignOut();
    console.info('Signed out');
    navigate('/');
  };

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Sign Out' />
      </Stack>
      {nostrProfile !== null &&
      nostrProfile !== undefined &&
      String(nostrProfile?.npub).length > 0 ? (
        <>
          <Space h='md' />
          <NpubView npub={nostrProfile.npub} />
          <Text>Click below to sign out.</Text>
          <Space h='md' />
          <Button
            leftSection={<IconLogout />}
            className={`${classes.primaryPurpleBackgroundColor}`}
            radius='md'
            variant='filled'
            onClick={signOutClick}
            styles={{
              root: {
                color: 'white',
              },
            }}
          >
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
            onClick={(): void => {
              navigate('/signin');
            }}
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
