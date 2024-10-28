import { useGlobalContext } from '@/Global';
import classes from '@/ui/shell/AppStyles.module.css';
import { Anchor, AppShell, Container, Text } from '@mantine/core';
import { FC } from 'react';

export const AppFooter: FC = () => {
  const { localization, isInitialized } = useGlobalContext();

  const getLocalizedString = (key: string, fallback: string): string => {
    console.info('Footer state:', {
      isInitialized,
      localization,
      hasGetLocalizedString: localization?.getLocalizedString,
    });

    if (!isInitialized || !localization) {
      return fallback;
    }

    try {
      if (typeof localization.getLocalizedString === 'function') {
        return localization.getLocalizedString(key) ?? fallback;
      }
      return fallback;
    } catch (error) {
      console.error('Localization error:', error);
      return fallback;
    }
  };

  return (
    <AppShell.Footer>
      <Container fluid className={classes.footer}>
        <Anchor href='//truevote.org' className={classes.link} target='_blank'>
          <Text size='xs'>{getLocalizedString('COPYRIGHT', '© 2024 TrueVote, Inc.')}</Text>
        </Anchor>
        <Anchor
          href='//github.com/TrueVote/TrueVote.App/releases'
          className={classes.link}
          target='_blank'
        >
          <Text size='xs'>{getLocalizedString('VERSION', 'Version 0.9 Alpha')}</Text>
        </Anchor>
      </Container>
    </AppShell.Footer>
  );
};
