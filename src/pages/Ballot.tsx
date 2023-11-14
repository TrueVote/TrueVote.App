import {
  ElectionModel,
  RaceModel,
  SubmitBallotModel,
  SubmitBallotModelResponse,
} from '@/TrueVote.Api';
import { DBGetElectionById, DBSubmitBallot } from '@/services/DataClient';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { objectDifference } from '@/ui/Helpers';
import { Hero } from '@/ui/Hero';
import { Race } from '@/ui/Race';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Image,
  Modal,
  Text,
  Title,
} from '@mantine/core';
import _ from 'lodash';
import moment from 'moment';
import { FC, useState } from 'react';
import { NavigateFunction, Params, useNavigate, useParams } from 'react-router-dom';

export const Ballot: FC = () => {
  return <Election />;
};

const Election: FC = () => {
  const params: Params<string> = useParams();
  const navigate: NavigateFunction = useNavigate();
  const [visible, setVisible] = useState(false);
  const [opened, setOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const errorModal: any = (e: any) => {
    setErrorMessage(String(e));
    setOpened((v: any) => !v);
  };

  const { loading, error, data } = DBGetElectionById(params.electionId);
  if (loading) {
    return <TrueVoteLoader />;
  }
  if (error) {
    console.error(error);
    return <>`Error ${error.message}`</>;
  }
  console.info(data);

  const election: ElectionModel = data!.GetElectionById[0];

  const modifiedElection: ElectionModel = _.cloneDeep(election);

  const races: RaceModel[] = election.Races?.map((e: RaceModel) => (
    <Race race={e} key={e.RaceId} election={modifiedElection} />
  )) as unknown as RaceModel[];

  const HeaderImage: any = ({ election }: { election: ElectionModel }) => {
    if (
      election.HeaderImageUrl !== undefined &&
      election.HeaderImageUrl?.length !== undefined &&
      election.HeaderImageUrl?.length > 0
    ) {
      return (
        <Card.Section>
          <div className={classes.electionHeaderImage}>
            <Image
              h={150}
              radius='lg'
              fit='contain'
              src={election.HeaderImageUrl}
              alt={election.Name}
            />
          </div>
        </Card.Section>
      );
    } else {
      return <></>;
    }
  };

  const submitBallot: any = async () => {
    console.info('Election', election);
    console.info('modifiedElection', modifiedElection);
    console.info('Diff', objectDifference(election, modifiedElection));

    setVisible((v: any) => !v);

    const submitBallotModel: SubmitBallotModel = {} as SubmitBallotModel;
    submitBallotModel.Election = modifiedElection;

    DBSubmitBallot(submitBallotModel)
      .then((res: SubmitBallotModelResponse) => {
        console.info('Success from ballot submission', res);
        setVisible((v: any) => !v);
        navigate('/thanks', { state: res });
      })
      .catch((e: any) => {
        console.error('Error from ballot submission', e);
        setVisible((v: any) => !v);
        errorModal(e);
      });
  };

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Hero title='Ballot' />
      <Title className={classes.titleSpaces} size='h4'>
        Complete your ballot below
      </Title>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <TrueVoteLoader visible={visible} />
        <Modal
          centered
          withCloseButton={true}
          title='Ballot Submission Error'
          onClose={(): void => setOpened(false)}
          opened={opened}
        >
          <Text>Error: {errorMessage}</Text>
        </Modal>
        <HeaderImage election={election} />
        <Text size='xl'>{election.Name}</Text>
        <Group mt='md' mb='xs'>
          <Badge color='green' variant='light'>
            Starts: {moment(election.StartDate).format('MMMM DD, YYYY')}
          </Badge>
          <Badge color='pink' variant='light'>
            Ends: {moment(election.EndDate).format('MMMM DD, YYYY')}
          </Badge>
        </Group>
        <Text size='sm' c='dimmed'>
          {election.Description}
        </Text>
        <Box className={classes.boxGap}></Box>
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
        <Button
          variant='light'
          color='blue'
          fullWidth
          mt='md'
          radius='md'
          onClick={(): void => submitBallot()}
        >
          Submit Ballot
        </Button>
      </Card>
    </Container>
  );
};
