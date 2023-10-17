import {
  BallotHashModel,
  BallotList,
  BallotModel,
  CandidateModel,
  RaceModel,
} from '@/TrueVote.Api';
import { DBGetBallotById } from '@/services/DataClient';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { formatCandidateName } from '@/ui/Helpers';
import { Hero } from '@/ui/Hero';
import {
  Box,
  Card,
  Checkbox,
  Container,
  Flex,
  Group,
  ScrollArea,
  SimpleGrid,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { IconCheckbox } from '@tabler/icons-react';
import moment from 'moment';
import { FC } from 'react';
import ReactJson from 'react-json-view';
import { Params, useParams } from 'react-router-dom';
import classes from './BallotView.module.css';

export const BallotView: FC = () => {
  return <Ballot />;
};

const Ballot: FC = () => {
  const colorScheme: 'dark' | 'light' = useColorScheme();
  const params: Params<string> = useParams();
  const getColor: any = () => (colorScheme === 'dark' ? 'monokai' : 'rjv-default');

  const { loading, error, data } = DBGetBallotById(params.ballotId);
  if (loading) {
    return <TrueVoteLoader />;
  }
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

  const races: any = ballot.Election?.Races?.map((r: RaceModel) => {
    return (
      <SimpleGrid spacing={'xs'} cols={1} key={r.RaceId}>
        <Text key={r.RaceId} color='yellow'>
          {r.Name}
        </Text>
        {r.Candidates?.map((c: CandidateModel) =>
          c.Selected === true ? (
            <Checkbox
              key={c.CandidateId}
              size={'xs'}
              icon={IconCheckbox}
              color='green'
              radius={'xl'}
              labelPosition='left'
              label={formatCandidateName(c)}
              className={classes.checkboxLabel}
              defaultChecked
            />
          ) : (
            <Text size={'xs'} key={c.CandidateId}>
              {formatCandidateName(c)}
            </Text>
          ),
        )}
      </SimpleGrid>
    );
  });

  return (
    <Container size='xs' px='xs'>
      <Hero title='Ballot Explorer' />
      <Title className={classes.titleSpaces} size='h4'>
        {ballot.Election?.Name}
      </Title>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Title className={classes.titleSpaces} size='h4'>
          Ballot Info
        </Title>
        <Group grow>
          <Card.Section>
            <Table verticalSpacing='xs' striped withColumnBorders>
              <tbody>
                <tr>
                  <td className={classes.tdLeft}>Submitted:</td>
                  <td>{moment(ballot.DateCreated).format('MMMM DD, YYYY, HH:MM:ss')}</td>
                </tr>
                <tr>
                  <td className={classes.tdLeft}>Ballot Id:</td>
                  <td>{ballot.BallotId}</td>
                </tr>
              </tbody>
            </Table>
          </Card.Section>
        </Group>
      </Card>
      <Box className={classes.boxGap}></Box>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Title className={classes.titleSpaces} size='h4'>
          Ballot
        </Title>
        <Group grow>
          <Card.Section>
            <Flex
              className={classes.flexGap}
              miw='50'
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
      <Box className={classes.boxGap}></Box>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Title className={classes.titleSpaces} size='h4'>
          Ballot Hash
        </Title>
        <Group grow>
          <Card.Section>
            <Table verticalSpacing='xs' striped withColumnBorders>
              <tbody>
                <tr>
                  <td className={classes.tdLeft}>Created:</td>
                  <td>{moment(ballotHash.DateCreated).format('MMMM DD, YYYY, HH:MM:ss')}</td>
                </tr>
                <tr>
                  <td className={classes.tdLeft}>Updated:</td>
                  <td>{moment(ballotHash.DateUpdated).format('MMMM DD, YYYY, HH:MM:ss')}</td>
                </tr>
                <tr>
                  <td className={classes.tdLeft}>Hash:</td>
                  <td>
                    <Text className={classes.tdFixedWidth}>{ballotHash.ServerBallotHashS}</Text>
                  </td>
                </tr>
                <tr>
                  <td className={classes.tdLeft}>Timestamp Id:</td>
                  <td>
                    {ballotHash.TimestampId ? (
                      ballotHash.TimestampId
                    ) : (
                      <Text color='red'>UNSET</Text>
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Section>
        </Group>
      </Card>
      <Box className={classes.boxGap}></Box>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Title className={classes.titleSpaces} size='h6'>
          Raw Data
        </Title>
        <Group mt='md' mb='xs'>
          <ScrollArea>
            <Text size='xs'>
              <div>
                <ReactJson src={ballot} name='Ballot' collapsed={true} theme={getColor()} />
              </div>
            </Text>
          </ScrollArea>
        </Group>
        <Group mt='md' mb='xs'>
          <ScrollArea>
            <Text size='xs'>
              <div>
                <ReactJson src={ballotHash} name='BallotHash' collapsed={true} theme={getColor()} />
              </div>
            </Text>
          </ScrollArea>
        </Group>
      </Card>
    </Container>
  );
};
