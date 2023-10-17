import { Hero } from '@/ui/Hero';
import { Container, Stack } from '@mantine/core';
import { FC } from 'react';

export const Home: FC = () => {
  return (
    <Container size='xs' px='xs'>
      <Stack gap={32}>
        <Hero title='Home' />
      </Stack>
    </Container>
  );
};
