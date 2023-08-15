import { BallotHashModel, BallotList, BallotModel, RaceModel } from '@/TrueVote.Api';
import { DBGetBallotById } from '@/services/DataClient';
import { Hero } from '@/ui/Hero';
import {
  Box,
  Card,
  Container,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
  createStyles,
} from '@mantine/core';
import moment from 'moment';
import { FC } from 'react';
import ReactJson from 'react-json-view';
import { Params, useParams } from 'react-router-dom';

const ballotViewStyles: any = createStyles(() => ({
  boxGap: {
    height: '15px',
  },
}));

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
  const { classes, cx } = ballotViewStyles();

  const { loading, error, data } = DBGetBallotById(params.ballotId);
  if (loading) return <>Loading Ballot...</>;
  if (error) {
    console.error(error);
    return <>`Error ${error.message}`</>;
  }
  console.info(data);

  const ballotList: BallotList = data!.GetBallotById;
  if (ballotList === null || ballotList === undefined) {
    return (
      <Container size='xs' px='xs'>
        <Text>BallotList Not Found</Text>
      </Container>
    );
  }
  const ballot: BallotModel = ballotList!.Ballots![0];
  if (ballot === null || ballot === undefined) {
    return (
      <Container size='xs' px='xs'>
        <Text>Ballot Not Found</Text>
      </Container>
    );
  }
  const ballotHash: BallotHashModel = ballotList!.BallotHashes![0];

  const races: RaceModel[] = ballot.Election?.Races?.map((e: RaceModel) => (
    <Text key={e.RaceId}>{e.Name}</Text>
  )) as unknown as RaceModel[];

  return (
    <Container size='xs' px='xs'>
      <Title size='h3'>{ballot.Election?.Name}</Title>
      <Box className={cx(classes.boxGap)}></Box>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        Submitted: {moment(ballot.DateCreated).format('MMMM DD, YYYY, HH:MM:SS')}
      </Card>
      <Box className={cx(classes.boxGap)}></Box>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Group position='center' spacing='xl' grow>
          <Card.Section>
            <Flex
              miw='50'
              bg='rgba(0, 0, 0, .3)'
              gap='sm'
              justify='flex-start'
              align='flex-start'
              direction='column'
              wrap='nowrap'
            >
              {races as any}
            </Flex>
          </Card.Section>
        </Group>
      </Card>
      <Box className={cx(classes.boxGap)}></Box>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Title size='h6'>Raw Data</Title>
        <Group position='apart' mt='md' mb='xs'>
          <ScrollArea>
            <Text size='xs'>
              <div>
                <ReactJson src={ballot} name='Ballot' collapsed={true} theme='monokai' />
              </div>
            </Text>
          </ScrollArea>
        </Group>
        <Group position='apart' mt='md' mb='xs'>
          <ScrollArea>
            <Text size='xs'>
              <div>
                <ReactJson src={ballotHash} name='BallotHash' collapsed={true} theme='monokai' />
              </div>
            </Text>
          </ScrollArea>
        </Group>
      </Card>
    </Container>
  );
};
