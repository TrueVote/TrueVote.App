import { Anchor, Footer, Group } from '@mantine/core';
import { FC } from 'react';
import { headerFooterStyles } from './AppStyles';

export const AppFooter: FC = () => {
  const { classes, cx } = headerFooterStyles();

  return (
    <Footer height={60} p='xs'>
      <Group position='right' spacing={20}>
        <Anchor href='//truevote.org' className={cx(classes.link)} target='_blank'>
          Copyright © 2023 TrueVote, Inc.
        </Anchor>
      </Group>
    </Footer>
  );
};
