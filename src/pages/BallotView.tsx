import {
  BallotHashModel,
  BallotList,
  BallotModel,
  CandidateModel,
  RaceModel,
} from '@/TrueVote.Api';
import { RaceTypes } from '@/TrueVote.Api.ManualModels';
import { DBGetBallotById } from '@/services/DataClient';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { formatCandidateName } from '@/ui/Helpers';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  Box,
  Card,
  Checkbox,
  Container,
  Flex,
  Group,
  HoverCard,
  ScrollArea,
  SimpleGrid,
  Table,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import _ from 'lodash';
import moment from 'moment';
import { FC } from 'react';
import ReactJson from 'react-json-view';
import { Params, useParams } from 'react-router-dom';

export const BallotView: FC = () => {
  return <Ballot />;
};

const Ballot: FC = () => {
  const { colorScheme } = useMantineColorScheme();
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
      <Container size='xs' px='xs' className={classes.container}>
        <Text>BallotList Not Found</Text>
      </Container>
    );
  }
  const ballot: BallotModel = ballotList!.Ballots![0];
  if (ballot === null || ballot === undefined) {
    return (
      <Container size='xs' px='xs' className={classes.container}>
        <Text>Ballot Not Found</Text>
      </Container>
    );
  }
  const ballotHash: BallotHashModel = ballotList!.BallotHashes![0];

  const sortCandidates: (candidates: CandidateModel[]) => CandidateModel[] = (
    candidates: CandidateModel[],
  ) => {
    return candidates.sort((a: CandidateModel, b: CandidateModel) => {
      const aSelected: boolean = a.Selected ?? false;
      const bSelected: boolean = b.Selected ?? false;

      const aMetadata: string = a.SelectedMetadata ?? '';
      const bMetadata: string = b.SelectedMetadata ?? '';

      if (aSelected === bSelected) {
        return aMetadata.localeCompare(bMetadata);
      }

      return Number(bSelected) - Number(aSelected);
    });
  };
  const races: any = ballot.Election?.Races?.map((r: RaceModel) => {
    return (
      <SimpleGrid spacing='xs' cols={1} key={r.RaceId}>
        <Text key={r.RaceId} component='span' className={classes.raceNameTitle}>
          <span className={classes.raceNameTitle}>{r.Name} - </span>
          <span className={classes.raceName}>{r.RaceTypeName}</span>
        </Text>
        {r.RaceType.toString() === RaceTypes.RankedChoice
          ? sortCandidates(_.cloneDeep(r.Candidates) ?? []).map((c: CandidateModel) =>
              c.Selected === true ? (
                <div key={c.CandidateId} className={classes.checkboxAndRank}>
                  <Checkbox
                    key={c.CandidateId}
                    size='sm'
                    color='green'
                    radius='xl'
                    labelPosition='left'
                    label={formatCandidateName(c)}
                    className={classes.checkboxLabel}
                    defaultChecked
                  />
                  <Text size='xs' component='span' className={classes.rankedIndex}>
                    <span className={classes.rankedIndex}>{Number(c.SelectedMetadata) + 1}</span>
                  </Text>
                </div>
              ) : (
                <Text
                  size='xs'
                  key={c.CandidateId}
                  component='span'
                  className={classes.raceNameUnselected}
                >
                  <span className={classes.raceNameUnselected}>{formatCandidateName(c)}</span>
                </Text>
              ),
            )
          : r.Candidates?.map((c: CandidateModel) =>
              c.Selected === true ? (
                <Checkbox
                  key={c.CandidateId}
                  size='sm'
                  color='green'
                  radius='xl'
                  labelPosition='left'
                  label={formatCandidateName(c)}
                  className={classes.checkboxLabel}
                  defaultChecked
                />
              ) : (
                <Text
                  size='xs'
                  key={c.CandidateId}
                  component='span'
                  className={classes.raceNameUnselected}
                >
                  <span className={classes.raceNameUnselected}>{formatCandidateName(c)}</span>
                </Text>
              ),
            )}
      </SimpleGrid>
    );
  });

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Hero title='Ballot Explorer' />
      <Title className={classes.titleSpaces} size='h4'>
        {ballot.Election?.Name}
      </Title>
      <Card shadow='sm' p='lg' radius='md' padding='none' withBorder>
        <Title className={classes.titleSpaces} size='h4'>
          Ballot Info
        </Title>
        <Group grow>
          <Card.Section>
            <Table
              key={ballot.BallotId}
              verticalSpacing='xs'
              striped
              withTableBorder
              withColumnBorders
            >
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td className={classes.tdRight}>Submitted:</Table.Td>
                  <Table.Td>
                    {moment(ballot.DateCreated).format('MMMM DD, YYYY, HH:MM:ss')}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td className={classes.tdRight}>Ballot Id:</Table.Td>
                  <Table.Td>{ballot.BallotId}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Card.Section>
        </Group>
      </Card>
      <Box className={classes.boxGap} />
      <Card shadow='sm' p='lg' radius='md' padding='none' withBorder>
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
      <Box className={classes.boxGap} />
      <Card shadow='sm' p='lg' radius='md' padding='none' withBorder>
        <Title className={classes.titleSpaces} size='h4'>
          Ballot Hash
        </Title>
        <Group grow>
          <Card.Section>
            <Table verticalSpacing='xs' striped withTableBorder withColumnBorders>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td className={classes.tdRight}>Created:</Table.Td>
                  <Table.Td>
                    {moment(ballotHash.DateCreated).format('MMMM DD, YYYY, HH:MM:ss')}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td className={classes.tdRight}>Updated:</Table.Td>
                  <Table.Td>
                    {moment(ballotHash.DateUpdated).format('MMMM DD, YYYY, HH:MM:ss')}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td className={classes.tdRight}>Hash:</Table.Td>
                  <Table.Td className={classes.tdLeft}>
                    <HoverCard shadow='md'>
                      <HoverCard.Target>
                        <span className={classes.textChopped}>{ballotHash.ServerBallotHashS}</span>
                      </HoverCard.Target>
                      <HoverCard.Dropdown>
                        <Text size='sm'>{ballotHash.ServerBallotHashS}</Text>
                      </HoverCard.Dropdown>
                    </HoverCard>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td className={classes.tdRight}>Timestamp Id:</Table.Td>
                  <Table.Td>
                    {ballotHash.TimestampId ? (
                      ballotHash.TimestampId
                    ) : (
                      <span className={classes.textAlert}>Pending</span>
                    )}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Card.Section>
        </Group>
      </Card>
      <Box className={classes.boxGap} />
      <Card shadow='sm' p='lg' radius='md' padding='none' withBorder>
        <Title className={classes.titleSpaces} size='h4'>
          Raw Data
        </Title>
        <Group mt='md' mb='xs'>
          <ScrollArea className={classes.rawJson}>
            <ReactJson src={ballot} name='Ballot' collapsed={true} theme={getColor()} />
          </ScrollArea>
        </Group>
        <Group mt='md' mb='xs'>
          <ScrollArea className={classes.rawJson}>
            <ReactJson src={ballotHash} name='BallotHash' collapsed={true} theme={getColor()} />
          </ScrollArea>
        </Group>
      </Card>
    </Container>
  );
};
