import {
  BallotHashModel,
  BallotList,
  BallotModel,
  CandidateModel,
  RaceModel,
} from '@/TrueVote.Api';
import { DBGetBallotById } from '@/services/DataClient';
import { formatCandidateName } from '@/ui/Helpers';
import { Hero } from '@/ui/Hero';
import {
  Box,
  Card,
  Checkbox,
  CheckboxIcon,
  Container,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Table,
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
  checkboxLabel: {
    label: {
      color: 'lightgreen',
    },
  },
}));

export const BallotView: FC = () => {
  return (
    <Container size='xs' px='xs'>
      <Stack spacing={32}>
        <Hero title='Ballot Explorer' />
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

  const races: any = ballot.Election?.Races?.map((r: RaceModel) => {
    return (
      <>
        <Text key={r.RaceId} color='gold'>
          {r.Name}
        </Text>
        {r.Candidates?.map((c: CandidateModel) => (
          <>
            {c.Selected === true ? (
              <>
                <Checkbox
                  size={'xs'}
                  icon={CheckboxIcon}
                  color='green'
                  radius={'xl'}
                  labelPosition='left'
                  label={formatCandidateName(c)}
                  className={cx(classes.checkboxLabel)}
                  checked
                />
              </>
            ) : (
              <Text size={'xs'} key={c.CandidateId}>
                {formatCandidateName(c)}
              </Text>
            )}
          </>
        ))}
      </>
    );
  });

  return (
    <Container size='xs' px='xs'>
      <Title size='h3'>{ballot.Election?.Name}</Title>
      <Box className={cx(classes.boxGap)}></Box>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Text color='yellow' size={'md'}>
          Submitted: {moment(ballot.DateCreated).format('MMMM DD, YYYY, HH:MM:ss')}
        </Text>
      </Card>
      <Box className={cx(classes.boxGap)}></Box>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Title size='h4'>Ballot</Title>
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
        <Title size='h4'>Ballot Hash</Title>
        <Group position='left' spacing='xl' grow>
          <Card.Section>
            <Table verticalSpacing='xs' fontSize={'xs'} striped withBorder withColumnBorders>
              <tbody>
                <tr>
                  <td>Created:</td>
                  <td>{moment(ballotHash.DateCreated).format('MMMM DD, YYYY, HH:MM:ss')}</td>
                </tr>
                <tr>
                  <td>Updated:</td>
                  <td>{moment(ballotHash.DateUpdated).format('MMMM DD, YYYY, HH:MM:ss')}</td>
                </tr>
                <tr>
                  <td>Hash:</td>
                  <td>{ballotHash.ServerBallotHashS}</td>
                </tr>
                <tr>
                  <td>Timestamp Id:</td>
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
