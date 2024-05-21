import { useGlobalContext } from '@/Global';
import classes from '@/ui/shell/AppStyles.module.css';
import { Anchor, AppShell, Container, Text } from '@mantine/core';
import { FC } from 'react';

export const AppFooter: FC = () => {
  const { localization } = useGlobalContext();

  return (
    <AppShell.Footer>
      <Container fluid className={classes.footer}>
        <Anchor href='//truevote.org' className={classes.link} target='_blank'>
          <Text size='xs'>
            {localization?.getLocalizedString('COPYRIGHT')} © 2023 TrueVote, Inc.
          </Text>
        </Anchor>
        <Anchor
          href='//github.com/TrueVote/TrueVote.App/releases'
          className={classes.link}
          target='_blank'
        >
          <Text size='xs'>{localization?.getLocalizedString('VERSION')} 1.0</Text>
        </Anchor>
      </Container>
    </AppShell.Footer>
  );
};
