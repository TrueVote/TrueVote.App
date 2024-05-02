import { useGlobalContext } from '@/Global';
import { SecureString, UserModel } from '@/TrueVote.Api';
import { DBSaveUser } from '@/services/DataClient';
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

export const Preferences: any = () => {
  const clipboard: any = useClipboard({ timeout: 500 });
  const emailIcon: any = <IconMail style={{ width: rem(16), height: rem(16) }} />;
  const { nostrProfile } = useGlobalContext();
  const { userModel, updateUserModel } = useGlobalContext();
  const [isClicked, setIsClicked] = useState(false);
  const [savedPreferences, setSavedPreferences] = useState('');

  const [checkedValues, setCheckedValues] = useState<string[]>(
    userModel?.UserPreferences
      ? Object.entries(userModel.UserPreferences)
          .filter(([_, value]) => value)
          .map(([key]) => key)
      : [],
  );

  const handleGroupChange = (values: string[]) => {
    setCheckedValues(values);

    const updatedPreferences = Object.fromEntries(
      Object.entries(userModel?.UserPreferences || {}).map(([key, _]) => [
        key,
        values.includes(key),
      ]),
    );

    if (userModel) {
      userModel.UserPreferences = updatedPreferences;
      updateUserModel(userModel);
    }
  };

  const savePreferences: any = (): any => {
    console.info('savePreferences()');

    if (userModel === undefined) {
      setSavedPreferences('User Model undefined');
      setTimeout(() => setIsClicked(false), 3000);
      return;
    }

    setIsClicked(true);
    setSavedPreferences('Saving');
    DBSaveUser(userModel)
      .then((res: UserModel) => {
        console.info('DBSaveUser', res);
        updateUserModel(res);
        setSavedPreferences('Saved');
        setTimeout(() => setIsClicked(false), 3000);
      })
      .catch((e: SecureString) => {
        console.error('Error from DBSaveUser', e);
        setSavedPreferences('Error saving preferences: ' + e.Value);
        setTimeout(() => setIsClicked(false), 3000);
      });
  };

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
                    onChange={(event: any): void => console.info(event.currentTarget.value)}
                    value={userModel?.Email}
                  ></TextInput>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={classes.tdRight}>Public Key:</Table.Td>
                <Table.Td className={classes.tdRight}>
                  <Table withRowBorders={false} verticalSpacing='xs'>
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td className={classes.tdLeft}>
                          <HoverCard shadow='md'>
                            <HoverCard.Target>
                              <span className={classes.textChoppedSmall}>{nostrProfile?.npub}</span>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                              <Text size='sm'>{nostrProfile?.npub}</Text>
                            </HoverCard.Dropdown>
                          </HoverCard>
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            onClick={(): void => clipboard.copy(nostrProfile?.npub)}
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
                    </Table.Tbody>
                  </Table>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Stack>
                    <Checkbox.Group
                      label='Push Notifications:'
                      value={checkedValues}
                      onChange={handleGroupChange}
                      size='sm'
                      description='Select notification types'
                    >
                      <Space h='md'></Space>
                      <Checkbox
                        value='NotificationNewElections'
                        label='New Elections'
                        key='New Elections'
                        size='sm'
                        className={classes.radioBody}
                      />
                      <Checkbox
                        value='NotificationElectionStart'
                        label='Election Start'
                        key='Election Start'
                        size='sm'
                        className={classes.radioBody}
                      />
                      <Checkbox
                        value='NotificationElectionEnd'
                        label='Election End'
                        key='Election End'
                        size='sm'
                        className={classes.radioBody}
                      />
                      <Checkbox
                        value='NotificationNewTrueVoteFeatures'
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
          <Table className={classes.tableAuto} withRowBorders={false}>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className={classes.tdLeft}>
                  <Button
                    radius='md'
                    color='green'
                    variant='light'
                    onClick={(): void => savePreferences()}
                  >
                    Save Preferences
                  </Button>
                </Table.Td>
                <Table.Td className={classes.tdLeft}>
                  <Text>{isClicked ? savedPreferences : ''}</Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
