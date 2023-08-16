import { AppFooter } from '@/ui/shell/AppFooter';
import { AppHeader } from '@/ui/shell/AppHeader';
import { AppShell, Group } from '@mantine/core';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const MainLayout: FC = () => {
  return (
    <AppShell
      padding='xs'
      fixed={false}
      // Enables top header
      header={<AppHeader />}
      // Enables footer
      footer={<AppFooter />}
      styles={(theme: any): any => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      <Group position='center' grow>
        <Outlet />
      </Group>
    </AppShell>
  );
};
