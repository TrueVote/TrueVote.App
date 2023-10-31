import { useGlobalContext } from '@/Global';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Container, Image, Space, Stack, Text } from '@mantine/core';
import { FC } from 'react';
import { Link } from 'react-router-dom';

export const Profile: FC = () => {
  const { nostrProfile } = useGlobalContext();

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Profile' />
      </Stack>
      {nostrProfile !== undefined && String(nostrProfile.name).length > 0 ? (
        <>
          <Image
            alt='Avatar'
            radius='xl'
            src={nostrProfile?.avatar}
            className={classes.profileImage}
          />
          <Text className={classes.profileName}>{nostrProfile.name}</Text>
          <Text className={classes.profileText}>
            <b>Signed In Public Key:</b> {nostrProfile.npub}
          </Text>
          <Space h='md'></Space>
          <Text className={classes.profileText}>
            <b>Bio:</b> {nostrProfile.bio}
          </Text>
          <Space h='md'></Space>
          <Text className={classes.profileText}>
            <b>Nip05:</b> {nostrProfile.nip05}
          </Text>
          <Space h='md'></Space>
          <Space h='md'></Space>
          <Link className={classes.pagelinkActive} to='/signout'>
            Sign Out
          </Link>
        </>
      ) : (
        <>
          <Stack>
            <Link className={classes.pagelinkActive} to='/signin'>
              Sign In
            </Link>
            <Link className={classes.pagelinkActive} to='/register'>
              Register
            </Link>
          </Stack>
        </>
      )}
    </Container>
  );
};
