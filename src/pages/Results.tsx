import { CandidateResult, ElectionModel, ElectionResults } from '@/TrueVote.Api';
import {
  electionDetailsByIdQuery,
  electionResultsByIdQuery,
  electionResultsByIdSubscription,
} from '@/services/GraphQLSchemas';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { useQuery, useSubscription } from '@apollo/client';
import {
  Alert,
  Box,
  Card,
  Container,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { IconInfoCircle, IconSearch, IconSum } from '@tabler/icons-react';
import { FC, useEffect, useMemo, useState } from 'react';
import ReactJson from 'react-json-view';
import { Link, Params, useParams } from 'react-router-dom';
import { Cell, Pie, PieChart } from 'recharts';
import resultsclasses from './Results.module.css';

// eslint-disable-next-line no-unused-vars
const useChartColors = (): ((index: number) => string) => {
  const COLORS = [
    '#6277b7', // Blue
    '#21b371', // Green
    '#d97757', // Coral
    '#1c2336', // Dark Blue
    '#FFA500', // Orange
    '#6A0DAD', // Purple
    '#1E90FF', // Dodger Blue
    '#32CD32', // Lime Green
    '#FFD700', // Gold
    '#FF69B4', // Hot Pink
    '#20B2AA', // Light Sea Green
    '#BA55D3', // Medium Orchid
  ];
  return (_index: number) => COLORS[_index % COLORS.length];
};

const groupSmallSlices = (data: CandidateResult[], threshold: number): CandidateResult[] => {
  const totalVotes = data.reduce((sum, item) => sum + item.TotalVotes, 0);
  const result = data.reduce((acc, item) => {
    if (item.TotalVotes / totalVotes < threshold) {
      // If there's already an "Other" category, add to it
      const otherIndex = acc.findIndex((i) => i.CandidateName === 'Other');
      if (otherIndex !== -1) {
        acc[otherIndex].TotalVotes += item.TotalVotes;
      } else {
        // Only create "Other" category if there are actual votes
        if (item.TotalVotes > 0) {
          acc.push({ CandidateName: 'Other', TotalVotes: item.TotalVotes, CandidateId: '' });
        }
      }
    } else {
      acc.push(item);
    }
    return acc;
  }, [] as CandidateResult[]);

  // Filter out "Other" if it ended up with 0 votes
  return result.filter((item) => item.CandidateName !== 'Other' || item.TotalVotes > 0);
};

const renderSimpleLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  value: number;
}): JSX.Element => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const textAnchor = cos >= 0 ? 'start' : 'end';
  const xOffset = cos >= 0 ? 5 : -5;

  return (
    <text x={x + xOffset} y={y} fill='white' textAnchor={textAnchor} dominantBaseline='central'>
      <tspan x={x + xOffset} dy='-7' fontSize='14px'>
        {value.toLocaleString()}
      </tspan>
      <tspan x={x + xOffset} dy='16' fontSize='12px'>
        {`(${(percent * 100).toFixed(0)}%)`}
      </tspan>
    </text>
  );
};

const CustomLegend: FC<{
  data: Array<{
    name: string;
    value: number;
    partyAffiliation: string;
    fill: string;
  }>;
  totalVotes: number;
}> = ({ data, totalVotes }) => (
  <Stack gap='sm' mt='md'>
    {data.map((entry, index) => (
      <Group key={index} align='center'>
        <div
          style={{
            width: 16,
            height: 16,
            backgroundColor: entry.fill,
            borderRadius: 3,
            marginRight: 8,
          }}
        />
        <Box style={{ flex: 1 }}>
          <Text size='sm' fw={500}>
            {entry.name}
          </Text>
          {entry.partyAffiliation && (
            <Text size='xs' c='dimmed' fs='italic'>
              {entry.partyAffiliation}
            </Text>
          )}
        </Box>
        <Group gap='xs'>
          <Text size='sm' fw={500}>
            {entry.value.toLocaleString()} votes
          </Text>
          <Text size='sm' c='dimmed'>
            ({((entry.value / totalVotes) * 100).toFixed(0)}%)
          </Text>
        </Group>
      </Group>
    ))}
    <Divider my='sm' />
    <Group justify='flex-end'>
      <Text size='sm' fw={500}>
        {totalVotes.toLocaleString()} Vote{totalVotes !== 1 ? 's' : ''}
      </Text>
    </Group>
  </Stack>
);

export const Results: FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const params: Params<string> = useParams();
  const { electionId } = useParams<{ electionId: string }>();
  const [electionResults, setElectionResults] = useState<ElectionResults | undefined>();
  const [electionDetails, setElectionDetails] = useState<ElectionModel | undefined>();
  const getColor: () => 'monokai' | 'rjv-default' = () =>
    colorScheme === 'dark' ? 'monokai' : 'rjv-default';
  const colorIndex = useChartColors();

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
    variables: { ElectionId: electionId },
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
    variables: { ElectionId: params.electionId },
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

  const processedRaces = useMemo(() => {
    if (!electionResults || !electionDetails) return [];
    return electionResults.Races.map((race) => {
      const raceDetails = electionDetails.Races.find((r) => r.RaceId === race.RaceId);
      // Sort the candidates by votes in descending order before grouping
      const sortedCandidates = [...race.CandidateResults].sort(
        (a, b) => b.TotalVotes - a.TotalVotes,
      );
      const groupedCandidates = groupSmallSlices(sortedCandidates, 0.05);
      const totalVotes = race.CandidateResults.reduce(
        (sum, candidate) => sum + candidate.TotalVotes,
        0,
      );
      return {
        ...race,
        raceDetails,
        totalVotes,
        groupedCandidates: groupedCandidates.map((c) => {
          const candidateDetails = raceDetails?.Candidates.find(
            (cd) => cd.CandidateId === c.CandidateId,
          );
          return {
            ...c,
            PartyAffiliation: candidateDetails?.PartyAffiliation ?? '',
          };
        }),
      };
    });
  }, [electionResults, electionDetails]);

  if (resultsLoading || detailsLoading) return <TrueVoteLoader />;

  if (resultsError) return <Text>Error loading election results: {resultsError.message}</Text>;
  if (detailsError) return <Text>Error loading election details: {detailsError.message}</Text>;
  if (!electionResults || !electionDetails) return <Text>Election Data Not Found</Text>;

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Hero title='Results' />
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
              <ThemeIcon size={56} radius='md' className={resultsclasses.icon}>
                <IconSum size={56} />
              </ThemeIcon>
              <Box>
                <Text className={resultsclasses.label}>Ballots Submitted</Text>
                <Text className={resultsclasses.value}>
                  <Link
                    to={`/ballotsbyelection/${electionId}`}
                    className={resultsclasses.numberContainer}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {electionResults?.TotalBallots?.toLocaleString() || 0}
                    <IconSearch size={14} className={resultsclasses.magnifierIcon} />
                  </Link>{' '}
                </Text>
              </Box>
            </Group>
            <Box>
              <Text className={resultsclasses.label}>Ballots Hashed</Text>
              <Text className={resultsclasses.value}>
                {electionResults?.TotalBallotsHashed?.toLocaleString() || 0}
              </Text>
            </Box>
          </Group>
        </Stack>{' '}
      </Paper>
      <Box className={classes.boxGap} />
      <Stack gap='md'>
        {processedRaces.map((r) => (
          <Card shadow='sm' p='lg' radius='md' padding='xl' withBorder key={r.RaceId}>
            <Title className={classes.titleSpaces} size='h4'>
              {r.RaceName}: {r.totalVotes.toLocaleString()} Vote{r.totalVotes !== 1 ? 's' : ''}
            </Title>
            {r.totalVotes > 0 ? (
              <>
                <PieChart width={380} height={280}>
                  <Pie
                    data={r.groupedCandidates.map((c) => ({
                      name: c.CandidateName,
                      value: c.TotalVotes,
                      partyAffiliation: c.PartyAffiliation,
                    }))}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={renderSimpleLabel}
                    outerRadius={130}
                    fill='#8884d8'
                    dataKey='value'
                  >
                    {r.groupedCandidates.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colorIndex(index)} />
                    ))}
                  </Pie>
                </PieChart>
                <CustomLegend
                  data={r.groupedCandidates.map((c, index) => ({
                    name: c.CandidateName,
                    value: c.TotalVotes,
                    partyAffiliation: c.PartyAffiliation,
                    fill: colorIndex(index),
                  }))}
                  totalVotes={r.totalVotes}
                />
              </>
            ) : (
              <Text>No votes recorded yet</Text>
            )}
          </Card>
        ))}
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
