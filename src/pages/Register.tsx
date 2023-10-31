import { getNostrPublicKey } from '@/services/NostrHelper';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Button, Container, Space, Stack, Text } from '@mantine/core';
import { FC } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const nostrPublicKey: any = getNostrPublicKey();
  const navigate: NavigateFunction = useNavigate();

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Register' />
      </Stack>
      {nostrPublicKey === null || String(nostrPublicKey).length === 0 ? (
        <>
          <Text>
            If you do not have a nostr key, click below to generate one - (functionality needed WIP)
          </Text>
          <Space h='md'></Space>
          <Text>
            If you already have a nostr key,{' '}
            <Link to='/signin' className={classes.linkActive}>
              sign in
            </Link>
            .
          </Text>
        </>
      ) : (
        <>
          <Space h='md'></Space>
          <Text>Already Signed In</Text>
          <Space h='md'></Space>
          <Text>Signed In Key: {nostrPublicKey}</Text>
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
      )}
    </Container>
  );
};
