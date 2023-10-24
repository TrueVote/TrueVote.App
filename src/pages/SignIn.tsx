import { nostrKeyKeyHandler } from '@/services/NostrHelper';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Button, Container, Image, Space, Stack, Text, Textarea } from '@mantine/core';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

export const SignIn: FC = () => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [valid, setValid] = useState(false);

  const handleChange: any = (e: any): void => {
    const { error, message, valid } = nostrKeyKeyHandler(e);

    setError(error);
    setMessage(message);
    setValid(valid);
  };

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Sign In' />
      </Stack>
      <Text>
        To sign in, please provide your nostr secret key. If you would like to create a new
        identity, go to the{' '}
        <Link to='/register' className={classes.linkActive}>
          {' '}
          sign up page
        </Link>
        .
      </Text>
      <Space h='md'></Space>
      <Textarea
        description='Your secret key'
        placeholder='Nostr nsec1 key'
        onChange={handleChange}
      />
      <Space h='xl'>
        <Text c='red'>{error}</Text>
        <Text c='green'>{message}</Text>
      </Space>
      <Button radius='md' color='green' variant='light' disabled={!valid}>
        Sign In
      </Button>
      <Space h='md'></Space>
      <Text>
        Or, sign in with a browser extension, such as{' '}
        <Link to='https://getalby.com' className={classes.linkActive}>
          Alby
        </Link>
        .
        <Image className={classes.albyImage} component={Link} to='https://getalby.com' />
      </Text>
    </Container>
  );
};
