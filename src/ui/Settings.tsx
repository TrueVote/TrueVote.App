import { getNostrPrivateKey, getNostrPublicKeyNpub } from '@/services/NostrHelper';
import classes from '@/ui/shell/AppStyles.module.css';
import { Accordion, Stack, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

export const Settings: FC = () => {
  const nostrPublicKey: string | null = getNostrPublicKeyNpub();
  const nostrPrivateKey: string | null = getNostrPrivateKey();

  return (
    <Accordion
      chevronPosition='right'
      variant='separated'
      chevron={<IconChevronRight size={26} />}
      className={classes.accordion}
    >
      <Accordion.Item key='Preferences' value='Preferences'>
        <Accordion.Control icon={'⚙️'}>Preferences</Accordion.Control>
        <Accordion.Panel>
          User preferences
          <Stack>
            <Text>{nostrPublicKey}</Text>
            <Text>{nostrPrivateKey}</Text>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item key='Election Access Keys' value='Election Access Keys'>
        <Accordion.Control icon={'🗳️'}>Election Access Keys</Accordion.Control>
        <Accordion.Panel>
          Codes authenticating voter for each election
          <Stack>
            <Text>hi</Text>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
