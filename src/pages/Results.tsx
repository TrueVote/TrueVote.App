import { CandidateResult, ElectionResults } from '@/TrueVote.Api';
import { DBGetElectionResultsById } from '@/services/GraphQLDataClient';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { useApolloClient } from '@apollo/client';
import {
  Box,
  Card,
  Container,
  Group,
  ScrollArea,
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
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#FF6B6B',
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
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
  value: number;
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
  const voteText = `${value} vote${value !== 1 ? 's' : ''}`;

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
      <tspan x={x + xOffset} dy='22' fontSize='14px'>
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
  const apolloClient = useApolloClient();
  const params: Params<string> = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [electionResults, setElectionResult] = useState<ElectionResults | undefined>();
  const getColor: () => 'monokai' | 'rjv-default' = () =>
    colorScheme === 'dark' ? 'monokai' : 'rjv-default';
  const colorIndex = useChartColors();

  // Pre-process the data once electionResults are available
  const processedRaces = useMemo(() => {
    if (!electionResults) return [];
    return electionResults.Races.map((race) => ({
      ...race,
      groupedCandidates: groupSmallSlices(race.CandidateResults, 0.05),
    }));
  }, [electionResults]);

  useEffect(() => {
    const fetchResults = async (): Promise<void> => {
      try {
        const fetchedResults: ElectionResults = await DBGetElectionResultsById(
          apolloClient,
          params.electionId!,
        );

        setElectionResult(fetchedResults);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setLoading(false);
      }
    };
    fetchResults();
  }, [apolloClient, params.electionId]);

  if (loading) {
    return <TrueVoteLoader />;
  }

  if (error) {
    console.error(error);
    return <>`Error ${error.message}`</>;
  }

  if (electionResults === undefined) {
    return (
      <Container size='xs' px='xs' className={classes.container}>
        <Text>Election Results Not Found</Text>
      </Container>
    );
  }

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Hero title='Results' />
      <Text>Ballots Submitted: {electionResults.TotalBallots}</Text>
      {processedRaces.map((r) => (
        <div key={r.RaceId}>
          <Title className={classes.titleSpaces} size='h4'>
            {r.RaceName}
          </Title>
          <PieChart width={500} height={500}>
            <Pie
              data={r.groupedCandidates.map((c) => ({
                name: c.CandidateName,
                value: c.TotalVotes,
              }))}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={250}
              fill='#8884d8'
              dataKey='value'
            >
              {r.groupedCandidates.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colorIndex(index)} />
              ))}
            </Pie>
          </PieChart>
        </div>
      ))}
      <Box className={classes.boxGap} />
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
