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
import { ballotViewStyles } from '@/ui/shell/AppStyles';
import {
  Box,
  Card,
  Checkbox,
  CheckboxIcon,
  Container,
  Flex,
  Group,
  MantineTheme,
  ScrollArea,
  SimpleGrid,
  Table,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import moment from 'moment';
import { FC } from 'react';
import ReactJson from 'react-json-view';
import { Params, useParams } from 'react-router-dom';

export const BallotView: FC = () => {
  return <Ballot />;
};

const Ballot: FC = () => {
  const theme: MantineTheme = useMantineTheme();
  const params: Params<string> = useParams();
  const { classes, cx } = ballotViewStyles(theme);

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

  const races: any =
    ballot.Election == null || ballot.Election.Races == null ? (
      <></>
    ) : (
      ballot.Election.Races.map((r: RaceModel) => {
        return (
          <SimpleGrid spacing={'xs'} cols={1} key={r.RaceId}>
            <Text key={r.RaceId} color='yellow'>
              {r.Name}
            </Text>
            {r.Candidates == null
              ? undefined
              : r.Candidates.map((c: CandidateModel) =>
                  c.Selected === true ? (
                    <Checkbox
                      key={c.CandidateId}
                      size={'xs'}
                      icon={CheckboxIcon}
                      color='green'
                      radius={'xl'}
                      labelPosition='left'
                      label={formatCandidateName(c)}
                      className={cx(classes.checkboxLabel)}
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
      })
    );

  return (
    <Container size='xs' px='xs'>
      <Hero title='Ballot Explorer' />
      <Title className={cx(classes.titleSpaces)} size='h4'>
        {ballot.Election == null ? '' : ballot.Election.Name}
      </Title>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Title className={cx(classes.titleSpaces)} size='h4'>
          Ballot Info
        </Title>
        <Group position='center' spacing='xl' grow>
          <Card.Section>
            <Table verticalSpacing='xs' fontSize={'xs'} striped withBorder withColumnBorders>
              <tbody>
                <tr>
                  <td className={cx(classes.tdLeft)}>Submitted:</td>
                  <td>{moment(ballot.DateCreated).format('MMMM DD, YYYY, HH:MM:ss')}</td>
                </tr>
                <tr>
                  <td className={cx(classes.tdLeft)}>Ballot Id:</td>
                  <td>{ballot.BallotId}</td>
                </tr>
              </tbody>
            </Table>
          </Card.Section>
        </Group>
      </Card>
      <Box className={cx(classes.boxGap)}></Box>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Title className={cx(classes.titleSpaces)} size='h4'>
          Ballot
        </Title>
        <Group position='center' spacing='xl' grow>
          <Card.Section>
            <Flex
              className={cx(classes.flexGap)}
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
      <Box className={cx(classes.boxGap)}></Box>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Title className={cx(classes.titleSpaces)} size='h4'>
          Ballot Hash
        </Title>
        <Group position='center' spacing='xl' grow>
          <Card.Section>
            <Table verticalSpacing='xs' fontSize={'xs'} striped withBorder withColumnBorders>
              <tbody>
                <tr>
                  <td className={cx(classes.tdLeft)}>Created:</td>
                  <td>{moment(ballotHash.DateCreated).format('MMMM DD, YYYY, HH:MM:ss')}</td>
                </tr>
                <tr>
                  <td className={cx(classes.tdLeft)}>Updated:</td>
                  <td>{moment(ballotHash.DateUpdated).format('MMMM DD, YYYY, HH:MM:ss')}</td>
                </tr>
                <tr>
                  <td className={cx(classes.tdLeft)}>Hash:</td>
                  <td>
                    <Text className={cx(classes.tdFixedWidth)}>{ballotHash.ServerBallotHashS}</Text>
                  </td>
                </tr>
                <tr>
                  <td className={cx(classes.tdLeft)}>Timestamp Id:</td>
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
        <Title className={cx(classes.titleSpaces)} size='h6'>
          Raw Data
        </Title>
        <Group position='apart' mt='md' mb='xs'>
          <ScrollArea>
            <Text size='xs'>
              <div>
                <ReactJson
                  src={ballot}
                  name='Ballot'
                  collapsed={true}
                  theme={theme.colorScheme === 'dark' ? 'monokai' : 'rjv-default'}
                />
              </div>
            </Text>
          </ScrollArea>
        </Group>
        <Group position='apart' mt='md' mb='xs'>
          <ScrollArea>
            <Text size='xs'>
              <div>
                <ReactJson
                  src={ballotHash}
                  name='BallotHash'
                  collapsed={true}
                  theme={theme.colorScheme === 'dark' ? 'monokai' : 'rjv-default'}
                />
              </div>
            </Text>
          </ScrollArea>
        </Group>
      </Card>
    </Container>
  );
};
