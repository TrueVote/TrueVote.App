import { ElectionModel } from '@/TrueVote.Api';
import { DBAllElections } from '@/services/DataClient';
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
} from '@tabler/icons-react';
import { FC, Fragment, ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrueVoteLoader } from './CustomLoader';

export const ElectionCode: FC = () => {
  const theme: MantineTheme = useMantineTheme();
  const listCheckIcon: any = <IconListCheck style={{ width: rem(16), height: rem(16) }} />;
  const [accessCode, setAccessCode] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [codeEntered, setCodeEntered] = useState(false);

  const applyCode: any = (): any => {
    setIsClicked(true);
    setTimeout(() => setCodeEntered(true), 800);
    console.info('Access Code', accessCode);
    setTimeout(() => setIsClicked(false), 1000);
  };

  return (
    <Accordion
      chevronPosition='right'
      variant='separated'
      chevron={<IconChevronRight size={26} />}
      className={classes.accordion}
    >
      <Accordion.Item key='ElectionCodes' value='ElectionCodes'>
        <Accordion.Control icon='🗳️'>Election Codes</Accordion.Control>
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
                    onClick={(): void => applyCode()}
                    variant={isClicked ? 'filled' : 'outline'}
                  >
                    <IconCheck style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          {codeEntered && (
            <>
              <Table className={classes.table} withRowBorders={false}>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td colSpan={3} className={classes.tdCenter}>
                      <Text className={classes.largeText}>My Elections:</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td colSpan={3}>
                      <AllElections theme={theme} />
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

// TODO Remove pulling all the elections and just pull the one for the election entered.
const AllElections: any = ({ theme }: { theme: MantineTheme }) => {
  const { colorScheme } = useMantineColorScheme();
  const { loading, error, data } = DBAllElections();
  if (loading) {
    return <TrueVoteLoader />;
  }
  if (error) {
    console.error(error);
    return <>`Error ${error.message}`</>;
  }
  console.info(data);

  const getColor: any = (color: string) => theme.colors[color][colorScheme === 'dark' ? 5 : 7];

  const item: any = [data!.GetElection[0]];

  const items: any = item.map(
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
          </Accordion.Panel>
        </Accordion.Item>
      </Fragment>
    ),
  );

  return (
    <>
      <Accordion
        chevronPosition='right'
        variant='contained'
        chevron={<IconChevronRight size={26} />}
        className={classes.accordion}
      >
        {items}
      </Accordion>
    </>
  );
};
