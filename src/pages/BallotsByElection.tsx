import { BallotIdInfo, ElectionModel, ElectionResults } from '@/TrueVote.Api';
import {
  electionDetailsByIdQuery,
  electionResultsByIdQuery,
  electionResultsByIdSubscription,
} from '@/services/GraphQLSchemas';
import { Pagination } from '@/ui/BallotPagination';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { useQuery, useSubscription } from '@apollo/client';
import {
  Accordion,
  Alert,
  Box,
  Button,
  Card,
  Container,
  Group,
  Paper,
  rem,
  ScrollArea,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconChevronRight,
  IconInfoCircle,
  IconMailSpark,
  IconSum,
  IconZoomIn,
} from '@tabler/icons-react';
import moment from 'moment';
import { FC, Fragment, ReactElement, useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { Link, Params, useParams } from 'react-router-dom';
import resultsclasses from './Results.module.css';

export const BallotsByElection: FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const params: Params<string> = useParams();
  const { electionId } = useParams<{ electionId: string }>();
  const [electionResults, setElectionResults] = useState<ElectionResults | undefined>();
  const [electionDetails, setElectionDetails] = useState<ElectionModel | undefined>();
  const getColor: any = () => (colorScheme === 'dark' ? 'monokai' : 'rjv-default');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize: number = 10;

  // Fetch election details
  const {
    loading: detailsLoading,
    error: detailsError,
    data: detailsData,
  } = useQuery(electionDetailsByIdQuery, {
    variables: { ElectionId: electionId },
    skip: !electionId,
    onCompleted: (data) => {
      console.info('Election details query completed:', data);
    },
    onError: (error) => {
      console.error('Election details query error:', error);
    },
  });

  // Update state when query data is received
  useEffect(() => {
    if (detailsData?.GetElectionById) {
      console.info('Updating election details from query');
      setElectionDetails(detailsData.GetElectionById[0]);
    }
  }, [detailsData]);

  // Query for initial results data
  const {
    loading: resultsLoading,
    error: resultsError,
    data: resultsData,
  } = useQuery(electionResultsByIdQuery, {
    variables: { ElectionId: electionId, offset: (currentPage - 1) * pageSize, limit: pageSize },
    skip: !electionId,
    onCompleted: (data) => {
      console.info('Election results query completed:', data);
    },
    onError: (error) => {
      console.error('Election results query error:', error);
    },
  });

  // Subscribe to results updates
  const { data: subscriptionData } = useSubscription(electionResultsByIdSubscription, {
    variables: { ElectionId: electionId, offset: (currentPage - 1) * pageSize, limit: pageSize },
    skip: !params.electionId,
    onData: ({ data }) => {
      console.info('Election results subscription data received:', data);
    },
    onError: (error) => {
      console.error('Election results subscription error:', error);
    },
  });

  // Update state when query data is received
  useEffect(() => {
    if (resultsData?.GetElectionResultsByElectionId) {
      console.info('Updating election results from query');
      setElectionResults(resultsData.GetElectionResultsByElectionId);
    }
  }, [resultsData]);

  // Update state when subscription data is received
  useEffect(() => {
    if (subscriptionData?.ElectionResultsUpdated) {
      console.info('Updating election results from subscription');
      setElectionResults(subscriptionData.ElectionResultsUpdated);
    }
  }, [subscriptionData]);

  if (resultsLoading || detailsLoading) return <TrueVoteLoader />;

  if (resultsError) return <Text>Error loading election results: {resultsError.message}</Text>;
  if (detailsError) return <Text>Error loading election details: {detailsError.message}</Text>;
  if (!electionResults || !electionDetails) return <Text>Election Ballot Data Not Found</Text>;

  const items = electionResults?.BallotIds.Items.map(
    (e: BallotIdInfo, i: number): ReactElement => (
      <Fragment key={i}>
        <Accordion.Item value={i.toString()} key={i}>
          <Accordion.Control key={i} icon={<IconMailSpark size={26} color={getColor('orange')} />}>
            {moment.utc(e.DateCreated).local().format('MMMM DD, YYYY, HH:mm:ss')} - {e.BallotId}
          </Accordion.Control>
          <Accordion.Panel>
            <Table
              key={e.BallotId}
              withRowBorders={false}
              withColumnBorders={false}
              withTableBorder={false}
            >
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td className={(classes.smallText, classes.tdRight)} c={getColor('orange')}>
                    Ballot Id:
                  </Table.Td>
                  <Table.Td className={(classes.smallText, classes.tdLeft)}>
                    <Text>{e.BallotId}</Text>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={2}>
                    {' '}
                    <Link to={`/ballotview/${e.BallotId}`} className={classes.buttonText}>
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
        </Accordion.Item>
      </Fragment>
    ),
  );

  const totalPages = Math.ceil((electionResults?.BallotIds.TotalCount || 0) / pageSize);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    // Scroll to top of list when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Hero title='All Ballots for Election' />
      <Text className={resultsclasses.subtitle}>{electionDetails?.Name}</Text>
      <Alert
        icon={<IconInfoCircle size={32} />}
        className={resultsclasses.notice}
        radius='md'
        variant='light'
      >
        This election displays results in real-time. Some elections will not display results until
        the voting window is closed and all ballots are tabulated.
      </Alert>
      <Paper p='xs' radius='md' className={resultsclasses.statsCard}>
        <Stack gap='xs'>
          <Text className={resultsclasses.sectionTitle}>Totals</Text>
          <Group align='flex-start'>
            <Group>
              <Link to={`/results/${electionId}`} className={classes.buttonText}>
                <ThemeIcon
                  size={56}
                  radius='md'
                  className={`${resultsclasses.icon} ${resultsclasses.interactiveIcon}`}
                >
                  <IconSum size={56} />
                </ThemeIcon>
              </Link>
              <Box>
                <Text className={resultsclasses.label}>Total Ballots Submitted</Text>
                <Text className={resultsclasses.value}>
                  {electionResults?.TotalBallots?.toLocaleString() || 0}
                </Text>
              </Box>
            </Group>
            <Box>
              <Text className={resultsclasses.label}>Total Ballots Hashed</Text>
              <Text className={resultsclasses.value}>
                {electionResults?.TotalBallotsHashed?.toLocaleString() || 0}
              </Text>
            </Box>
          </Group>
        </Stack>{' '}
      </Paper>{' '}
      <Box className={classes.boxGap} />
      <Stack gap='md'>
        <Box h={500} style={{ overflowY: 'auto' }}>
          {' '}
          <Accordion
            chevronPosition='right'
            variant='contained'
            chevron={<IconChevronRight size={26} />}
            className={classes.accordion}
          >
            {items}
          </Accordion>
        </Box>
        <Text ta='center' size='sm' c='dimmed'>
          Page {currentPage} of {totalPages}
        </Text>
        <Group justify='center' mb='xs'>
          <Text ta='center' size='sm' c='dimmed'>
            Showing {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, electionResults?.BallotIds.TotalCount || 0)} of{' '}
            {electionResults?.BallotIds.TotalCount || 0} ballots
          </Text>
        </Group>{' '}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />{' '}
      </Stack>
      <Card shadow='sm' p='lg' radius='md' padding='none' withBorder>
        <Title className={classes.titleSpaces} size='h4'>
          Raw Data
        </Title>
        <Group mt='md' mb='xs'>
          <ScrollArea className={classes.rawJson}>
            <ReactJson
              src={electionResults}
              name='Election Results'
              collapsed={true}
              theme={getColor()}
            />
          </ScrollArea>
        </Group>
      </Card>
    </Container>
  );
};
