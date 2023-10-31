import { useGlobalContext } from '@/Global';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Container, Space, Stack, Text } from '@mantine/core';
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
          <Text>Signed In Key: {nostrProfile.publicKey}</Text>
          <Space h='md'></Space>
          <Text>
            {nostrProfile.name} - {nostrProfile.avatar} - {nostrProfile.bio}
          </Text>
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
