import { useGlobalContext } from '@/Global';
import classes from '@/ui/shell/AppStyles.module.css';
import { Anchor, AppShell, Container, Text } from '@mantine/core';
import { FC } from 'react';

export const AppFooter: FC = () => {
  const { localization } = useGlobalContext();

  const getCopyright = (): string => {
    return localization?.getLocalizedString?.('COPYRIGHT') ?? '© 2024 TrueVote, Inc.';
  };

  const getVersion = (): string => {
    return localization?.getLocalizedString?.('VERSION') ?? 'Version 0.9 Alpha';
  };

  return (
    <AppShell.Footer>
      <Container fluid className={classes.footer}>
        <Anchor href='//truevote.org' className={classes.link} target='_blank'>
          <Text size='xs'>{getCopyright()}</Text>
        </Anchor>
        <Anchor
          href='//github.com/TrueVote/TrueVote.App/releases'
          className={classes.link}
          target='_blank'
        >
          <Text size='xs'>{getVersion()}</Text>
        </Anchor>
      </Container>
    </AppShell.Footer>
  );
};
