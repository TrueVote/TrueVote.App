import { useGlobalContext } from '@/Global';
import {
  ElectionModel,
  RaceModel,
  SubmitBallotModel,
  SubmitBallotModelResponse,
} from '@/TrueVote.Api';
import { BallotBinderStorage } from '@/services/BallotBinder';
import { electionDetailsByIdQuery } from '@/services/GraphQLSchemas';
import { DBSubmitBallot } from '@/services/RESTDataClient';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { ErrorModal } from '@/ui/ErrorModal';
import { formatErrorObject, objectDifference } from '@/ui/Helpers';
import { Hero } from '@/ui/Hero';
import { Race } from '@/ui/Race';
import classes from '@/ui/shell/AppStyles.module.css';
import { useQuery } from '@apollo/client';
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Image,
  rem,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconKey, IconListCheck } from '@tabler/icons-react';
import _ from 'lodash';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import { NavigateFunction, Params, useNavigate, useParams } from 'react-router-dom';

export const Ballot: FC = () => {
  const params: Params<string> = useParams();
  const navigate: NavigateFunction = useNavigate();
  const [electionDetails, setElectionDetails] = useState<ElectionModel | undefined>();
  const { electionId } = useParams<{ electionId: string }>();

  const {
    loading: detailsLoading,
    error: detailsError,
    data: detailsData,
  } = useQuery(electionDetailsByIdQuery, {
    variables: { ElectionId: electionId },
    skip: !electionId,
    onCompleted: (data) => {
      console.info('Election details query completed:', data);
    },
    onError: (error) => {
      console.error('Election details query error:', error);
    },
  });

  // Update state when query data is received
  useEffect(() => {
    if (detailsData?.GetElectionById) {
      console.info('Updating election details from query');
      setElectionDetails(detailsData.GetElectionById[0]);
    }
  }, [detailsData]);

  if (detailsLoading) {
    return <TrueVoteLoader />;
  }

  if (detailsError) {
    console.error(detailsError);
    return <>`Error ${detailsError.message}`</>;
  }

  if (!electionDetails) {
    return (
      <Container size='xs' px='xs' className={classes.container}>
        <Text>Election Not Found</Text>
      </Container>
    );
  }
  const election: ElectionModel = electionDetails;
  const electionBallot: ElectionModel = _.cloneDeep(election);

  return (
    <Election
      election={election}
      electionBallot={electionBallot}
      navigate={navigate}
      accessCodeProp={params.accessCode ?? ''}
    />
  );
};

interface ElectionProps {
  election: ElectionModel;
  electionBallot: ElectionModel;
  navigate: NavigateFunction;
  accessCodeProp: string;
}

const Election: FC<ElectionProps> = ({ election, electionBallot, navigate, accessCodeProp }) => {
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const listCheckIcon = <IconListCheck style={{ width: rem(16), height: rem(16) }} />;
  const [accessCode, setAccessCode] = useState(accessCodeProp);
  const { nostrProfile, userModel } = useGlobalContext();
  const ballotBinderStorage = new BallotBinderStorage(userModel?.UserId ?? '');
  const errorModal: any = (e: any) => {
    setErrorMessage(String(e));
    setOpened((v: any) => !v);
  };

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const isRaceValid = (race: RaceModel): boolean => {
    if (!race.Candidates) return false;

    const selectedCount = race.Candidates.filter((c) => c.Selected === true).length;
    const minChoices = race.MinNumberOfChoices ?? 0;
    const maxChoices = race.MaxNumberOfChoices ?? 0;

    const valid = selectedCount >= minChoices && selectedCount <= maxChoices;
    console.debug('isRaceValid()', 'Name', race.Name, selectedCount, minChoices, maxChoices, valid);

    return valid;
  };

  const areAllRacesValid = (races: RaceModel[]): boolean => {
    return accessCode.length > 0 && races.every(isRaceValid);
  };

  const updateSubmitButtonState = (): void => {
    setIsSubmitEnabled(areAllRacesValid(electionBallot.Races));
  };

  useEffect(() => {
    updateSubmitButtonState();
  }, [electionBallot.Races, accessCode]);

  const races: RaceModel[] = electionBallot.Races?.map((e: RaceModel) => (
    <Race race={e} key={e.RaceId} onSelectionChange={updateSubmitButtonState} />
  )) as unknown as RaceModel[];

  const HeaderImage: any = ({ election }: { election: ElectionModel }) => {
    if (
      election.HeaderImageUrl !== undefined &&
      election.HeaderImageUrl?.length !== undefined &&
      election.HeaderImageUrl?.length > 1
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
    console.info('electionBallot', electionBallot);
    console.info('Diff', objectDifference(election, electionBallot));

    if (nostrProfile === null || String(nostrProfile?.npub).length === 0) {
      errorModal('You must be logged in to submit a ballot.');
      return;
    }

    if (accessCode.length === 0) {
      errorModal('Election Access Code cannot be blank.');
      return;
    }

    setLoading(true);

    const submitBallotModel: SubmitBallotModel = {} as SubmitBallotModel;
    submitBallotModel.Election = electionBallot;
    submitBallotModel.AccessCode = accessCode;

    DBSubmitBallot(submitBallotModel)
      .then((res: SubmitBallotModelResponse) => {
        console.info('Success from ballot submission', res);
        setLoading(false);
        ballotBinderStorage.addOrUpdateBallotBinder(accessCode, res.BallotId, res.ElectionId);
        navigate('/thanks', { state: res });
      })
      .catch((e: any) => {
        console.error('Error from ballot submission', e);
        setLoading(false);
        errorModal(formatErrorObject(e));
      });
  };

  if (loading) {
    return <TrueVoteLoader />;
  }

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Hero title='Ballot' />
      <Title className={classes.titleSpaces} size='h4'>
        Complete your ballot below
      </Title>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <ErrorModal
          visible={opened}
          onClose={(): void => setOpened(false)}
          text={errorMessage}
          title='Ballot Submission Error'
        />
        <HeaderImage election={election} />
        <Text size='xl'>{election.Name}</Text>
        <Group mt='md' mb='xs'>
          <Badge color='green' variant='light'>
            {new Date().toISOString() > election.StartDate ? 'Started: ' : 'Starts: '}
            {moment.utc(election.StartDate).local().format('MMMM DD, YYYY, HH:mm:ss')}
          </Badge>
          <Badge color='pink' variant='light'>
            {new Date().toISOString() > election.EndDate ? 'Ended: ' : 'Ends: '}
            {moment.utc(election.EndDate).local().format('MMMM DD, YYYY, HH:mm:ss')}
          </Badge>
        </Group>{' '}
        <Text size='sm' c='dimmed'>
          {election.Description}
        </Text>
        <Box className={classes.boxGap} />
        <Card withBorder padding='md'>
          <div>
            <IconKey className={classes.accessIcon} size={20} stroke={1.5} />
            <span className={classes.accessTitle}>Enter Your Access Code:</span>
            <TextInput
              leftSection={listCheckIcon}
              maxLength={16}
              placeholder='Type / Paste your EAC here'
              value={accessCode}
              onChange={(event) => setAccessCode(event.currentTarget.value)}
              className={classes.accessInput}
            />
            <p className={classes.accessHelpText}>
              Enter the access code provided to authorize ballot submission
            </p>
          </div>
        </Card>
        <Box className={classes.boxGap} />
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
        {new Date().toISOString() >= election.StartDate &&
          new Date().toISOString() <= election.EndDate && (
            <Button
              variant='light'
              color='green'
              fullWidth
              radius='md'
              h={60}
              size='xl'
              className={classes.ballotButton}
              disabled={!isSubmitEnabled}
              onClick={(): void => submitBallot()}
            >
              Submit Ballot
            </Button>
          )}{' '}
      </Card>
    </Container>
  );
};
