import { AllElections } from '@/ui/AllElections';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Container } from '@mantine/core';
import { FC } from 'react';

export const Elections: FC = () => {
  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Hero title='Elections' />
      <AllElections />
    </Container>
  );
};
