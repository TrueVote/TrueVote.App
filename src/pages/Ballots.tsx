import { useGlobalContext } from '@/Global';
import { BallotList } from '@/TrueVote.Api';
import { BallotBinder, BallotBinderStorage } from '@/services/BallotBinder';
import { ballotDetailsByIdQuery } from '@/services/GraphQLSchemas';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { useLazyQuery } from '@apollo/client';
import {
  Accordion,
  Button,
  Container,
  MantineTheme,
  rem,
  Space,
  Table,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconChevronRight,
  IconMailExclamation,
  IconMailSpark,
  IconZoomIn,
} from '@tabler/icons-react';
import moment from 'moment';
import { FC, Fragment, ReactElement, useCallback, useEffect, useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

export const Ballots: FC = () => {
  const theme: MantineTheme = useMantineTheme();
  const { userModel } = useGlobalContext();
  const [ballotListArray, setBallotListArray] = useState<BallotList[]>([]);
  const [loading, setLoading] = useState(true);

  const [getBallotDetails, { error }] = useLazyQuery(ballotDetailsByIdQuery);

  const fetchBallotListArray = useCallback(async () => {
    if (!userModel?.UserId) return;

    const ballotBinderStorage = new BallotBinderStorage(userModel.UserId);
    const ballotBinders: BallotBinder[] = ballotBinderStorage.getAllBallotBinders();

    try {
      const fetchedBallotListArray: BallotList[] = await Promise.all(
        ballotBinders.map(async (binder: BallotBinder) => {
          const { data } = await getBallotDetails({
            variables: { BallotId: binder.BallotId },
          });
          return data.GetBallotById;
        }),
      );
      setBallotListArray(fetchedBallotListArray);
    } catch (err) {
      console.error('Error fetching ballot details:', err);
    } finally {
      setLoading(false);
    }
  }, [userModel?.UserId, getBallotDetails]);

  useEffect(() => {
    fetchBallotListArray();
  }, [fetchBallotListArray]);

  if (loading) {
    return <TrueVoteLoader />;
  }

  if (error) {
    console.error(error);
    return <>`Error ${error.message}`</>;
  }

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Hero title='My Ballots' />
      <AllBallots theme={theme} ballots={ballotListArray} />
    </Container>
  );
};

export const AllBallots: React.FC<{
  theme: MantineTheme;
  ballots: BallotList[];
}> = ({ theme, ballots }) => {
  const { colorScheme } = useMantineColorScheme();
  const getColor = (color: string): string => theme.colors[color][colorScheme === 'dark' ? 5 : 7];
  const navigate: NavigateFunction = useNavigate();

  if (ballots.length == 0) {
    return (
      <Container size='xs' px='xs' className={classes.container}>
        <Text size='lg'>No Ballots Found</Text>
        <Space h='md' />
        <Button
          radius='md'
          color='green'
          variant='light'
          fullWidth
          h={40}
          size='xl'
          onClick={() => navigate('/elections')}
          styles={{
            label: {
              fontSize: 18,
            },
          }}
        >
          Vote in an Election
        </Button>
      </Container>
    );
  }

  const items = ballots.map(
    (e: BallotList, i: number): ReactElement => (
      <Fragment key={i}>
        <Accordion.Item value={i.toString()} key={i}>
          {e.Ballots.length === 0 ? (
            <Accordion.Control
              key={i}
              icon={<IconMailExclamation size={26} color={getColor('red')} />}
            >
              Ballot data missing
            </Accordion.Control>
          ) : (
            <Accordion.Control
              key={i}
              icon={<IconMailSpark size={26} color={getColor('orange')} />}
            >
              {moment.utc(e.Ballots[0].DateCreated).local().format('MMMM DD, YYYY, HH:mm:ss')} -{' '}
              {e.Ballots[0].Election?.Name}
            </Accordion.Control>
          )}
          {e.Ballots.length > 0 ? (
            <Accordion.Panel>
              <Table
                key={e.Ballots[0].BallotId}
                withRowBorders={false}
                withColumnBorders={false}
                withTableBorder={false}
              >
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td
                      className={(classes.smallText, classes.tdRight)}
                      c={getColor('orange')}
                    >
                      Ballot Id:
                    </Table.Td>
                    <Table.Td className={(classes.smallText, classes.tdLeft)}>
                      <Text>{e.Ballots[0].BallotId}</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td colSpan={2}>
                      {' '}
                      <Link
                        to={`/ballotview/${e.Ballots[0].BallotId}`}
                        className={classes.buttonText}
                      >
                        <Button
                          fullWidth
                          radius='md'
                          color='green'
                          variant='light'
                          rightSection={<IconZoomIn style={{ width: rem(16), height: rem(16) }} />}
                        >
                          <span className={classes.buttonText}>Details</span>
                        </Button>
                      </Link>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Accordion.Panel>
          ) : (
            <></>
          )}
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
