import { useGlobalContext } from '@/Global';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Container, Stack, Text } from '@mantine/core';
import { FC } from 'react';

export const Home: FC = () => {
  const { nostrProfile } = useGlobalContext();

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Home' />
      </Stack>
      {nostrProfile !== undefined && String(nostrProfile.name).length > 0 ? (
        <>
          <Text>Welcome, {nostrProfile.name}</Text>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
};
