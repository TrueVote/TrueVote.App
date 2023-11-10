import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Container, Stack } from '@mantine/core';
import { FC } from 'react';

export const About: FC = () => {
  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='About' />
      </Stack>
    </Container>
  );
};
