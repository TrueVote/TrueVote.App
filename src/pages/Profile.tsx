import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Container, Stack } from '@mantine/core';
import { FC } from 'react';
import { Link } from 'react-router-dom';

export const Profile: FC = () => {
  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Profile' />
      </Stack>
      <Stack>
        <Link className={classes.pagelinkActive} to='/signin'>
          Sign In
        </Link>
        <Link className={classes.pagelinkActive} to='/register'>
          Register
        </Link>
      </Stack>
    </Container>
  );
};
