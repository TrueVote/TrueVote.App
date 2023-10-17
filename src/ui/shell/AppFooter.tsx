import classes from '@/ui/shell/AppStyles.module.css';
import { Anchor, AppShell, Group, Text } from '@mantine/core';
import { FC } from 'react';

export const AppFooter: FC = () => {
  return (
    <AppShell.Footer p='xs' className={classes.footer}>
      <Group gap={20}>
        <Anchor href='//truevote.org' className={classes.link} target='_blank'>
          <Text size={'xs'}>Copyright © 2023 TrueVote, Inc.</Text>
        </Anchor>
        <Anchor
          href='//github.com/TrueVote/TrueVote.App/releases'
          className={classes.link}
          target='_blank'
        >
          <Text size={'xs'}>Version 1.0</Text>
        </Anchor>
      </Group>
    </AppShell.Footer>
  );
};
