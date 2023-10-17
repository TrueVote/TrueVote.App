import { AppFooter } from '@/ui/shell/AppFooter';
import { AppHeader } from '@/ui/shell/AppHeader';
import classes from '@/ui/shell/AppStyles.module.css';
import { AppShell, Group } from '@mantine/core';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const HEADER_HEIGHT: number = 50;
export const FOOTER_HEIGHT: number = 60;

export const MainLayout: FC = () => {
  return (
    <AppShell padding='xs' header={{ height: HEADER_HEIGHT }} footer={{ height: FOOTER_HEIGHT }}>
      <AppHeader />
      <Group className={classes.root} grow>
        <Outlet />
      </Group>
      <AppFooter />
    </AppShell>
  );
};
