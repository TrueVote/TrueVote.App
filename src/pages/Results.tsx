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
  Box,
  Card,
  Container,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { FC, useEffect, useMemo, useState } from 'react';
import ReactJson from 'react-json-view';
import { Params, useParams } from 'react-router-dom';
import { Cell, Pie, PieChart } from 'recharts';

// eslint-disable-next-line no-unused-vars
const useChartColors = (): ((index: number) => string) => {
  const COLORS = [
    '#6277b7',
    '#21b371',
    '#d97757',
    '#1c2336',
    '#fddb33',
    '#6A0DAD',
    '#1E90FF',
    '#32CD32',
    '#FFD700',
    '#FF69B4',
    '#20B2AA',
    '#BA55D3',
  ];
  return (_index: number) => COLORS[_index % COLORS.length];
};

const groupSmallSlices = (data: CandidateResult[], threshold: number): CandidateResult[] => {
  const totalVotes = data.reduce((sum, item) => sum + item.TotalVotes, 0);
  return data.reduce((acc, item) => {
    if (item.TotalVotes / totalVotes < threshold) {
      const otherIndex = acc.findIndex((i) => i.CandidateName === 'Other');
      if (otherIndex !== -1) {
        acc[otherIndex].TotalVotes += item.TotalVotes;
      } else {
        acc.push({ CandidateName: 'Other', TotalVotes: item.TotalVotes, CandidateId: '' });
      }
    } else {
      acc.push(item);
    }
    return acc;
  }, [] as CandidateResult[]);
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
  value,
  partyAffiliation,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
  value: number;
  partyAffiliation: string;
}): JSX.Element => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const isLeftSide = cos < 0;
  const textAnchor = isLeftSide ? 'end' : 'start';
  const xOffset = isLeftSide ? -5 : 5;

  // More aggressive text wrapping function
  const wrapText = (text: string, maxLength: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    words.forEach((word) => {
      if (currentLine.length + word.length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const nameLines = wrapText(name, 10); // More aggressive wrapping
  const percentText = `${(percent * 100).toFixed(0)}%`;
  const voteText = `${value} Vote${value !== 1 ? 's' : ''}`;

  return (
    <text x={x + xOffset} y={y} fill='white' textAnchor={textAnchor} dominantBaseline='central'>
      {nameLines.map((line, i) => (
        <tspan
          x={x + xOffset}
          dy={i === 0 ? `-${(nameLines.length - 1) * 18}` : 20}
          key={i}
          fontSize='16px'
          fontWeight='bold'
        >
          {line}
        </tspan>
      ))}
      <tspan x={x + xOffset} dy='22' fontSize='12px' fontStyle='italic'>
        {partyAffiliation}
      </tspan>
      <tspan x={x + xOffset} dy='20' fontSize='14px'>
        {voteText}
      </tspan>
      <tspan x={x + xOffset} dy='20' fontSize='14px'>
        {percentText}
      </tspan>
    </text>
  );
};

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
    variables: { electionId: params.electionId },
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
      const groupedCandidates = groupSmallSlices(race.CandidateResults, 0.05);
      const totalVotes = race.CandidateResults.reduce(
        (sum, candidate) => sum + candidate.TotalVotes,
        0,
      );
      return {
        ...race,
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
      <Text size='xl'>{electionDetails?.Name}</Text>
      <Text size='l'>Total Ballots Submitted: {electionResults.TotalBallots}</Text>
      <Box className={classes.boxGap} />
      <Stack gap='md'>
        {processedRaces.map((r) => (
          <Card shadow='sm' p='lg' radius='md' padding='xl' withBorder key={r.RaceId}>
            <Title className={classes.titleSpaces} size='h4'>
              {r.RaceName}: {r.totalVotes} Vote{r.totalVotes !== 1 ? 's' : ''}{' '}
            </Title>
            <PieChart width={380} height={380}>
              <Pie
                data={r.groupedCandidates.map((c) => ({
                  name: c.CandidateName,
                  value: c.TotalVotes,
                  partyAffiliation: c.PartyAffiliation,
                }))}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={190}
                fill='#8884d8'
                dataKey='value'
              >
                {r.groupedCandidates.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colorIndex(index)} />
                ))}
              </Pie>
            </PieChart>
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
