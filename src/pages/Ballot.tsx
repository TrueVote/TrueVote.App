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
import { ballotViewStyles } from '@/ui/shell/AppStyles';
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Image,
  MantineTheme,
  Modal,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import _ from 'lodash';
import moment from 'moment';
import { FC, useState } from 'react';
import { NavigateFunction, Params, useNavigate, useParams } from 'react-router-dom';

export const Ballot: FC = () => {
  return <Election />;
};

const Election: FC = () => {
  const theme: MantineTheme = useMantineTheme();
  const params: Params<string> = useParams();
  const { classes, cx } = ballotViewStyles(theme);
  const navigate: NavigateFunction = useNavigate();
  const [visible, setVisible] = useState(false);
  const [opened, setOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const errorModal: any = (e: any) => {
    setErrorMessage(e);
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

  const races: RaceModel[] | undefined =
    election.Races == null
      ? undefined
      : (election.Races.map((e: RaceModel) => (
          <Race race={e} key={e.RaceId} election={modifiedElection} />
        )) as unknown as RaceModel[]);

  const HeaderImage: any = ({ election }: { election: ElectionModel }) => {
    if (
      election !== undefined &&
      election.HeaderImageUrl !== undefined &&
      election.HeaderImageUrl != null &&
      election.HeaderImageUrl.length !== undefined &&
      election.HeaderImageUrl.length !== null &&
      election.HeaderImageUrl.length > 0
    ) {
      return (
        <Card.Section>
          <Image src={election.HeaderImageUrl} alt={election.Name} />
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
    <Container size='xs' px='xs'>
      <Hero title='Ballot' />
      <Title className={cx(classes.titleSpaces)} size='h4'>
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
        <Group position='apart' mt='md' mb='xs'>
          <Text size='xl'>{election.Name}</Text>
          <Badge color='pink' variant='light'>
            Starts: {moment(election.StartDate).format('MMMM DD, YYYY')}
          </Badge>
        </Group>
        <Text size='sm' color='dimmed'>
          {election.Description}
        </Text>
        <Box className={cx(classes.boxGap)}></Box>
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
