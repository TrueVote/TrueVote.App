import { Anchor, Footer, Group, Text } from '@mantine/core';
import { FC } from 'react';
import { headerFooterStyles } from './AppStyles';

export const AppFooter: FC = () => {
  const { classes, cx } = headerFooterStyles();

  return (
    <Footer height={60} p='xs'>
      <Group position='left' spacing={20}>
        <Anchor href='//truevote.org' className={cx(classes.link)} target='_blank'>
          <Text size={'xs'}>Copyright © 2023 TrueVote, Inc.</Text>
        </Anchor>
        <Anchor
          href='//github.com/TrueVote/TrueVote.App/releases'
          className={cx(classes.link)}
          target='_blank'
        >
          <Text size={'xs'}>Version 1.0</Text>
        </Anchor>
      </Group>
    </Footer>
  );
};
