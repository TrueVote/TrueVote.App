import { emptyUserModel, useGlobalContext } from '@/Global';
import { getNostrNpubFromStorage } from '@/services/NostrHelper';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { ElectionCode } from '@/ui/ElelctionCode';
import { Hero } from '@/ui/Hero';
import { Preferences } from '@/ui/Preferences';
import classes from '@/ui/shell/AppStyles.module.css';
import { Button, Container, Image, Space, Stack, Table, Text } from '@mantine/core';
import { IconLogin, IconLogout, IconUserPlus } from '@tabler/icons-react';
import { FC } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export const Profile: FC = () => {
  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Hero title='Profile' />
      <LoadProfile />
    </Container>
  );
};

const LoadProfile: any = () => {
  const navigate: NavigateFunction = useNavigate();
  const { nostrProfile } = useGlobalContext();
  const { userModel } = useGlobalContext();

  console.info('LoadProfile', nostrProfile, userModel);

  // Quick check to storage to see if we're even able to fetch a profile
  if (getNostrNpubFromStorage() !== null && userModel === emptyUserModel) {
    return <TrueVoteLoader />;
  }

  return (
    <>
      {nostrProfile !== undefined &&
      String(nostrProfile.displayName).length > 0 &&
      userModel !== undefined &&
      String(userModel.FullName).length > 0 ? (
        <>
          {nostrProfile?.picture !== undefined && String(nostrProfile.picture).length > 0 ? (
            <>
              <div className={classes.profileImageDiv}>
                <Image
                  alt='Avatar'
                  radius='xl'
                  src={nostrProfile?.picture}
                  className={classes.profileImage}
                />
              </div>
            </>
          ) : (
            <></>
          )}
          <Table
            verticalSpacing='xs'
            striped
            withTableBorder
            withColumnBorders
            className={classes.table}
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className={classes.tdRight}>nostr Name:</Table.Td>
                <Table.Td className={classes.profileName}>{nostrProfile.displayName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={classes.tdRight}>User Full Name:</Table.Td>
                <Table.Td className={classes.profileName}>{userModel.FullName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={classes.tdRight}>About:</Table.Td>
                <Table.Td className={classes.profileText}>{nostrProfile.about}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={classes.tdRight}>Nip05:</Table.Td>
                <Table.Td className={classes.profileText}>{nostrProfile.nip05}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={classes.tdRight}>Email:</Table.Td>
                <Table.Td className={classes.profileText}>{userModel.Email}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Space h='md' />
          <ElectionCode />
          <Space h='md' />
          <Preferences />
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
      ) : (
        <>
          <Stack className={classes.profileButtons}>
            <Text size='md'>To get started with a new nostr account for TrueVote, Register</Text>
            <Button
              leftSection={<IconUserPlus />}
              className={`${classes.profileButton} ${classes.primaryGreenBackgroundColor}`}
              radius='md'
              variant='filled'
              onClick={(): void => {
                navigate('/register');
              }}
              styles={{
                root: {
                  color: 'white',
                },
              }}
            >
              Register
            </Button>
            <Text size='md'>Sign In if you have an existing nostr account</Text>
            <Button
              leftSection={<IconLogin />}
              className={`${classes.profileButton} ${classes.primaryPurpleBackgroundColor}`}
              radius='md'
              variant='filled'
              onClick={(): void => {
                navigate('/signin');
              }}
              styles={{
                root: {
                  color: 'white',
                },
              }}
            >
              Sign In
            </Button>
          </Stack>
        </>
      )}
    </>
  );
};
