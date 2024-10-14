import { ElectionResults } from '@/TrueVote.Api';
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
import { FC, useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { Params, useParams } from 'react-router-dom';

export const Results: FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const apolloClient = useApolloClient();
  const params: Params<string> = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [electionResults, setElectionResult] = useState<ElectionResults>();
  const getColor: any = () => (colorScheme === 'dark' ? 'monokai' : 'rjv-default');

  useEffect(() => {
    const fetchResults = async (): Promise<void> => {
      try {
        const fetchedResults: ElectionResults = await DBGetElectionResultsById(
          apolloClient,
          params.electionId,
        );

        setElectionResult(fetchedResults);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) {
    return <TrueVoteLoader />;
  }

  if (error) {
    console.error(error);
    return <>`Error ${error.message}`</>;
  }
  console.info(electionResults);

  if (electionResults === null || electionResults === undefined) {
    return (
      <Container size='xs' px='xs' className={classes.container}>
        <Text>Election Results Not Found</Text>
      </Container>
    );
  }

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Hero title='Results' />
      <Title className={classes.titleSpaces} size='h4'>
        {electionResults.ElectionId}
      </Title>
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
