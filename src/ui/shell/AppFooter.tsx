import { useGlobalContext } from '@/Global';
import classes from '@/ui/shell/AppStyles.module.css';
import { Anchor, AppShell, Container, Text } from '@mantine/core';
import { FC } from 'react';

export const AppFooter: FC = () => {
  const { localization } = useGlobalContext();
  const currentYear = new Date().getFullYear();

  return (
    <AppShell.Footer>
      <Container fluid className={classes.footer}>
        <Anchor href='//truevote.org' className={classes.link} target='_blank'>
          <Text size='xs'>© {currentYear} TrueVote, Inc.</Text>
        </Anchor>
        <Anchor
          href='//github.com/TrueVote/TrueVote.App/releases'
          className={classes.link}
          target='_blank'
        >
          <Text size='xs'>{localization?.getLocalizedString('VERSION', 'Version 0.9 Alpha')}</Text>
        </Anchor>
      </Container>
    </AppShell.Footer>
  );
};
