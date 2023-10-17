import { Hero } from '@/ui/Hero';
import { Container, Stack } from '@mantine/core';
import { FC } from 'react';

export const Profile: FC = () => {
  return (
    <Container size='xs' px='xs'>
      <Stack gap={32}>
        <Hero title='Profile' />
      </Stack>
    </Container>
  );
};
