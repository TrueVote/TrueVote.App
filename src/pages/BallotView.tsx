import { DBGetBallotById } from '@/services/DataClient';
import { BallotModel } from '@/TrueVote.Api';
import { Hero } from '@/ui/Hero';
import { Card, Container, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { FC } from 'react';
import { Params, useParams } from 'react-router-dom';

export const BallotView: FC = () => {
  return (
    <Container size='xs' px='xs'>
      <Stack spacing={32}>
        <Hero title='Ballot' />
      </Stack>
      <Ballot />
    </Container>
  );
};

const Ballot: FC = () => {
  const params: Params<string> = useParams();

  const { loading, error, data } = DBGetBallotById(params.ballotId);
  if (loading) return <>Loading Ballot...</>;
  if (error) {
    console.error(error);
    return <>`Error ${error.message}`</>;
  }
  console.info(data);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ballot: BallotModel = data.GetBallotById[0];

  return (
    <Card shadow='sm' p='lg' radius='md' withBorder>
      <Group position='apart' mt='md' mb='xs'>
        <ScrollArea>
          <Text size='xs'>
            <div>
              <pre>{JSON.stringify(ballot, null, '\t')}</pre>
            </div>
          </Text>
        </ScrollArea>
      </Group>
    </Card>
  );
};
