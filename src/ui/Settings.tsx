import { NostrProfile, getNostrPublicKeyNpub } from '@/services/NostrHelper';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  Accordion,
  ActionIcon,
  Button,
  Checkbox,
  HoverCard,
  Space,
  Stack,
  Table,
  Text,
  TextInput,
  rem,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import {
  IconChevronRight,
  IconClipboardCheck,
  IconClipboardCopy,
  IconMail,
} from '@tabler/icons-react';
import { useState } from 'react';

export const Settings: any = ({ nostrProfile }: { nostrProfile: NostrProfile }) => {
  const nostrPublicKey: string | null = getNostrPublicKeyNpub();
  const clipboard: any = useClipboard({ timeout: 500 });
  const emailIcon: any = <IconMail style={{ width: rem(16), height: rem(16) }} />;
  const [emailValue, setEmailValue] = useState(nostrProfile?.nip05);

  return (
    <Accordion
      chevronPosition='right'
      variant='separated'
      chevron={<IconChevronRight size={26} />}
      className={classes.accordion}
    >
      <Accordion.Item key='Preferences' value='Preferences'>
        <Accordion.Control icon={'⚙️'}>User Preferences</Accordion.Control>
        <Accordion.Panel>
          <h3>User Preferences</h3>
          <Table
            verticalSpacing='xs'
            striped
            withTableBorder
            withColumnBorders
            className={classes.table}
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className={classes.tdRight}>Email:</Table.Td>
                <Table.Td className={classes.tdLeft}>
                  <TextInput
                    leftSection={emailIcon}
                    placeholder='Email Address'
                    value={emailValue}
                    onChange={(event: any): void => setEmailValue(event.currentTarget.value)}
                  ></TextInput>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={classes.tdRight}>Public Key:</Table.Td>
                <Table withRowBorders={false} verticalSpacing='xs'>
                  <Table.Tr>
                    <Table.Td className={classes.tdLeft}>
                      <HoverCard shadow='md'>
                        <HoverCard.Target>
                          <Text className={classes.textChopped}>{nostrPublicKey}</Text>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size='sm'>{nostrPublicKey}</Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        onClick={(): void => clipboard.copy(nostrPublicKey)}
                        aria-label='Copy'
                        variant='transparent'
                      >
                        {clipboard.copied ? (
                          <IconClipboardCheck size={24} />
                        ) : (
                          <IconClipboardCopy size={24} />
                        )}
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                </Table>
              </Table.Tr>
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Stack>
                    <Checkbox.Group
                      label='Push Notifications:'
                      defaultValue={[
                        'NewElections',
                        'ElectionStart',
                        'ElectionEnd',
                        'NewTrueVoteFeatures',
                      ]}
                      size='sm'
                      description={'Select notification types'}
                    >
                      <Space h='md'></Space>
                      <Checkbox
                        value='NewElections'
                        label='New Elections'
                        key='New Elections'
                        size='sm'
                        className={classes.radioBody}
                      />
                      <Checkbox
                        value='ElectionStart'
                        label='Election Start'
                        key='Election Start'
                        size='sm'
                        className={classes.radioBody}
                      />
                      <Checkbox
                        value='ElectionEnd'
                        label='Election End'
                        key='Election End'
                        size='sm'
                        className={classes.radioBody}
                      />
                      <Checkbox
                        value='NewTrueVoteFeatures'
                        label='New TrueVote Features'
                        key='New TrueVote Features'
                        size='sm'
                        className={classes.radioBody}
                      />
                    </Checkbox.Group>
                  </Stack>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Space h='md'></Space>
          <Button radius='md' color='green' variant='light'>
            Save Preferences
          </Button>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
