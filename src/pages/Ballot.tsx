import { useGlobalContext } from '@/Global';
import {
  ElectionModel,
  RaceModel,
  SubmitBallotModel,
  SubmitBallotModelResponse,
} from '@/TrueVote.Api';
import { DBGetElectionById, DBSubmitBallot } from '@/services/DataClient';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { formatErrorObject, objectDifference } from '@/ui/Helpers';
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
  rem,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconListCheck } from '@tabler/icons-react';
import _ from 'lodash';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import { NavigateFunction, Params, useNavigate, useParams } from 'react-router-dom';

export const Ballot: FC = () => {
  const params: Params<string> = useParams();
  const navigate: NavigateFunction = useNavigate();

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
  const electionBallot: ElectionModel = _.cloneDeep(election);

  return (
    <Election
      election={election}
      electionBallot={electionBallot}
      navigate={navigate}
      accessCodeProp={params.accessCode ? params.accessCode : ''}
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
  const [visible, setVisible] = useState(false);
  const [opened, setOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const listCheckIcon = <IconListCheck style={{ width: rem(16), height: rem(16) }} />;
  const [accessCode, setAccessCode] = useState(accessCodeProp);
  const { nostrProfile } = useGlobalContext();

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

    setVisible((v: any) => !v);

    const submitBallotModel: SubmitBallotModel = {} as SubmitBallotModel;
    submitBallotModel.Election = electionBallot;
    submitBallotModel.AccessCode = accessCode;

    DBSubmitBallot(submitBallotModel)
      .then((res: SubmitBallotModelResponse) => {
        console.info('Success from ballot submission', res);
        setVisible((v: any) => !v);
        navigate('/thanks', { state: res });
      })
      .catch((e: any) => {
        console.error('Error from ballot submission', e);
        setVisible((v: any) => !v);
        errorModal(formatErrorObject(e));
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
          <Text style={{ whiteSpace: 'pre-wrap' }}>Error: {errorMessage}</Text>
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
        <Box className={classes.boxGap} />
        <Card.Section>
          <Card className={classes.cardWide} shadow='sm' p='xs' radius='lg' withBorder>
            <div className={classes.flexShell}>
              <TextInput
                leftSection={listCheckIcon}
                maxLength={16}
                placeholder='Election Access Code'
                value={accessCode}
                width='100px'
                onChange={(event) => setAccessCode(event.currentTarget.value)}
              />
            </div>
          </Card>
        </Card.Section>
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
        <Button
          variant='light'
          color='blue'
          fullWidth
          mt='md'
          radius='md'
          className={classes.ballotButton}
          disabled={!isSubmitEnabled}
          onClick={(): void => submitBallot()}
        >
          Submit Ballot
        </Button>
      </Card>
    </Container>
  );
};
