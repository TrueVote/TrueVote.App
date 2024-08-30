import { useGlobalContext } from '@/Global';
import { CheckCodeRequest, ElectionModel, SecureString } from '@/TrueVote.Api';
import { DBCheckAccessCode } from '@/services/DataClient';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  Accordion,
  ActionIcon,
  Button,
  MantineTheme,
  Space,
  Table,
  Text,
  TextInput,
  rem,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconCheck,
  IconCheckbox,
  IconChecklist,
  IconChevronRight,
  IconListCheck,
  IconTrash,
} from '@tabler/icons-react';
import { FC, ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const ElectionCode: FC = () => {
  const theme: MantineTheme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const getColor = (color: string): string => theme.colors[color][colorScheme === 'dark' ? 5 : 7];
  const listCheckIcon = <IconListCheck style={{ width: rem(16), height: rem(16) }} />;
  const [accessCode, setAccessCode] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { userModel, accessCodes, addAccessCode, removeAccessCode } = useGlobalContext();
  const [elections, setElections] = useState<ElectionModel[]>([]);

  useEffect(() => {
    const fetchElections = async (): Promise<void> => {
      if (accessCodes && accessCodes.length > 0) {
        const newElections = await Promise.all(
          accessCodes.map(async (ac) => {
            try {
              const checkCodeRequest: CheckCodeRequest = {
                UserId: userModel?.UserId ?? '',
                AccessCode: ac,
              };
              return await DBCheckAccessCode(checkCodeRequest);
            } catch (e) {
              console.error('Error from DBCheckAccessCode', e);
              return null;
            }
          }),
        );
        setElections(newElections.filter((e): e is ElectionModel => e !== null));
      }
    };
    fetchElections();
  }, [accessCodes, userModel]);

  const checkCode = async (): Promise<void> => {
    setIsClicked(true);
    setErrorMessage('');

    if (accessCodes && accessCodes.includes(accessCode)) {
      setErrorMessage('Access code already added');
      setTimeout(() => {
        setIsClicked(false);
        setErrorMessage('');
      }, 3000);
      return;
    }

    try {
      const res = await DBCheckAccessCode({
        UserId: userModel?.UserId ?? '',
        AccessCode: accessCode,
      });
      addAccessCode(accessCode);
      setElections((prev) => [...prev, res]);
    } catch (e) {
      setErrorMessage((e as SecureString).Value);
    } finally {
      setTimeout(() => {
        setIsClicked(false);
        setAccessCode('');
      }, 3000);
    }
  };

  const removeItem = (index: number): void => {
    setElections((prev) => prev.filter((_, i) => i !== index));
    if (accessCodes && accessCodes[index]) {
      removeAccessCode(accessCodes[index]);
    }
  };

  const renderElectionItem = (e: ElectionModel, i: number): ReactElement => (
    <Accordion.Item value={i.toString()} key={i}>
      <Accordion.Control icon={<IconChecklist size={26} color={getColor('orange')} />}>
        <Text>{e.Name}</Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Text>{e.Description}</Text>
        <Link
          to={`/ballot/${e.ElectionId}/${accessCodes ? accessCodes[i] : ''}`}
          className={classes.buttonText}
        >
          <Button
            fullWidth
            radius='md'
            color='green'
            variant='light'
            rightSection={<IconCheckbox style={{ width: rem(16), height: rem(16) }} />}
          >
            <span className={classes.buttonText}>Vote</span>
          </Button>
        </Link>
        <Space h='md' />
        <Button
          fullWidth
          radius='md'
          color='red'
          variant='light'
          rightSection={<IconTrash style={{ width: rem(16), height: rem(16) }} />}
          onClick={() => removeItem(i)}
        >
          <span className={classes.buttonText}>Remove</span>
        </Button>
      </Accordion.Panel>
    </Accordion.Item>
  );

  return (
    <Accordion
      chevronPosition='right'
      variant='separated'
      chevron={<IconChevronRight size={26} />}
      className={classes.accordion}
    >
      <Accordion.Item key='ElectionCodes' value='ElectionCodes'>
        <Accordion.Control icon='🗳️'>
          Election Codes {accessCodes && accessCodes.length > 0 ? `(${accessCodes.length})` : ''}
        </Accordion.Control>
        <Accordion.Panel>
          <Table verticalSpacing='xs' striped withTableBorder className={classes.table}>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className={classes.tdRight} width='110px'>
                  Access Code:
                </Table.Td>
                <Table.Td className={classes.tdLeft}>
                  <TextInput
                    leftSection={listCheckIcon}
                    placeholder='Election Access Code'
                    value={accessCode}
                    onChange={(event) => setAccessCode(event.currentTarget.value)}
                  />
                </Table.Td>
                <Table.Td className={`${classes.tdRight} ${classes.tdTight}`}>
                  <ActionIcon
                    color='green'
                    radius='xl'
                    aria-label='ElectionAccessCode'
                    onClick={checkCode}
                    variant={isClicked ? 'filled' : 'outline'}
                  >
                    <IconCheck style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
              {errorMessage && (
                <Table.Tr>
                  <Table.Td colSpan={3} className={classes.tdCenter}>
                    <Text>{errorMessage}</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
          {elections.length > 0 && (
            <>
              <Table className={classes.table} withRowBorders={false}>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td colSpan={3} className={classes.tdLeft}>
                      <Text className={classes.largeText}>My Elections:</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td colSpan={3}>
                      <Accordion
                        chevronPosition='right'
                        variant='contained'
                        chevron={<IconChevronRight size={26} />}
                        className={classes.accordion}
                      >
                        {elections.map(renderElectionItem)}
                      </Accordion>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
              <Space h='md' />
            </>
          )}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
