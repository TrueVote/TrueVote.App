import { useGlobalContext } from '@/Global';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Container, Stack, Text } from '@mantine/core';
import { FC } from 'react';

export const Home: FC = () => {
  const { nostrProfile } = useGlobalContext();
  const { localization } = useGlobalContext();

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title={localization?.getLocalizedString('HOMEPAGE')} />
      </Stack>
      {nostrProfile !== undefined && String(nostrProfile.displayName).length > 0 ? (
        <>
          <Text>
            {localization?.getLocalizedString('WELCOME')}, {nostrProfile.displayName}
          </Text>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
};
