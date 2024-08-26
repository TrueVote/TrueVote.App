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
import { FC, Fragment, ReactElement, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const ElectionCode: FC = () => {
  const theme: MantineTheme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const getColor: any = (color: string) => theme.colors[color][colorScheme === 'dark' ? 5 : 7];
  const listCheckIcon: any = <IconListCheck style={{ width: rem(16), height: rem(16) }} />;
  const [accessCode, setAccessCode] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { userModel } = useGlobalContext();
  const { accessCodes, addAccessCode, removeAccessCode } = useGlobalContext();
  const [elections, setElections] = useState<ElectionModel[]>([]);
  const addElection = (e: ElectionModel): void => {
    setElections((prevElections: ElectionModel[]) => {
      return [...prevElections, e];
    });
  };
  const removeElection = (index: number): void => {
    setElections((prevElections: ElectionModel[]) => {
      return prevElections.filter((_, i) => i !== index);
    });
  };
  const hasRun = useRef(false); // Prevents the effect from running multiple times

  useEffect(() => {
    if (hasRun.current) return; // Prevent re-running the effect
    hasRun.current = true;

    if (accessCodes && accessCodes.length > 0) {
      accessCodes.forEach((ac: string) => {
        const checkCodeRequest: CheckCodeRequest = {
          UserId: userModel && userModel.UserId ? userModel.UserId : '',
          AccessCode: ac,
        };

        DBCheckAccessCode(checkCodeRequest)
          .then((res: ElectionModel) => {
            console.info('DBCheckAccessCode', res);
            addElection(res);
          })
          .catch((e: SecureString) => {
            console.error('Error from DBCheckAccessCode', e);
          });
      });
    }
  }, [accessCodes, userModel]);

  const checkCode: any = async () => {
    console.info('checkCode', accessCode);

    setIsClicked(true);
    setErrorMessage('');

    if (accessCodes?.includes(accessCode)) {
      setErrorMessage('Access code already added');
      setTimeout(() => setIsClicked(false), 3000);
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    const checkCodeRequest: CheckCodeRequest = {
      UserId: userModel && userModel.UserId ? userModel.UserId : '',
      AccessCode: accessCode,
    };

    DBCheckAccessCode(checkCodeRequest)
      .then((res: ElectionModel) => {
        console.info('DBCheckAccessCode', res);
        setTimeout(() => setIsClicked(false), 3000);
        addAccessCode(accessCode);
        addElection(res);
      })
      .catch((e: SecureString) => {
        console.error('Error from DBCheckAccessCode', e);
        setErrorMessage(e.Value);
        setTimeout(() => setIsClicked(false), 3000);
      });
  };

  const displayAccessCodeCount = (): string => {
    return accessCodes && accessCodes.length > 0 ? `(${accessCodes.length})` : '';
  };

  const removeItem = (i: number): void => {
    removeElection(i);
    if (accessCodes && accessCodes[i]) {
      removeAccessCode(accessCodes[i]);
    }
  };

  const items: any = elections.map(
    (e: ElectionModel, i: number): ReactElement => (
      <Fragment key={i}>
        <Accordion.Item value={i.toString()} key={i}>
          <Accordion.Control key={i} icon={<IconChecklist size={26} color={getColor('orange')} />}>
            <Text>{e.Name}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text>{e.Description}</Text>
            <Link to={`/ballot/${e.ElectionId}`} className={classes.buttonText}>
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
              onClick={(): void => {
                removeItem(i);
              }}
            >
              <span className={classes.buttonText}>Remove</span>
            </Button>
          </Accordion.Panel>
        </Accordion.Item>
      </Fragment>
    ),
  );

  return (
    <Accordion
      chevronPosition='right'
      variant='separated'
      chevron={<IconChevronRight size={26} />}
      className={classes.accordion}
    >
      <Accordion.Item key='ElectionCodes' value='ElectionCodes'>
        <Accordion.Control icon='🗳️'>Election Codes {displayAccessCodeCount()}</Accordion.Control>
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
                    onChange={(event: any): void => setAccessCode(event.currentTarget.value)}
                  />
                </Table.Td>
                <Table.Td className={(classes.tdRight, classes.tdTight)}>
                  <ActionIcon
                    color='green'
                    radius='xl'
                    aria-label='ElectionAccessCode'
                    onClick={(): void => checkCode()}
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
                        {items}
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
