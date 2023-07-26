import { DBGetElectionById, DBSubmitBallot } from '@/services/DataClient';
import { MerkleTree } from '@/services/MerkleTree';
import { ElectionModel, RaceModel, SubmitBallotModelResponse } from '@/TrueVote.Api';
import { objectDifference } from '@/ui/Helpers';
import { Hero } from '@/ui/Hero';
import { Race } from '@/ui/Race';
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import _ from 'lodash';
import moment from 'moment';
import { FC, useState } from 'react';
import { NavigateFunction, Params, useNavigate, useParams } from 'react-router-dom';

export const Ballot: FC = () => {
  return (
    <Container size='xs' px='xs'>
      <Stack spacing={32}>
        <Hero title='Ballot' />
      </Stack>
      <Election />
    </Container>
  );
};

const Election: FC = () => {
  const params: Params<string> = useParams();
  const navigate: NavigateFunction = useNavigate();
  const [visible, setVisible] = useState(false);
  const [opened, setOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const errorModal: any = (e: any) => {
    setErrorMessage(e);
    setOpened((v: any) => !v);
  };

  const { loading, error, data } = DBGetElectionById(params.electionId);
  if (loading) return <>Loading Ballot...</>;
  if (error) {
    console.error(error);
    return <>`Error ${error.message}`</>;
  }
  console.info(data);

  const election: ElectionModel = data!.GetElectionById[0];

  const modifiedElection: ElectionModel = _.cloneDeep(election);

  const races: any = election.Races?.map((e: RaceModel) => (
    <Race race={e} key={e.RaceId} election={modifiedElection} />
  ));

  const HeaderImage: any = ({ election }: { election: ElectionModel }) => {
    if (
      election.HeaderImageUrl !== undefined &&
      election.HeaderImageUrl?.length !== undefined &&
      election.HeaderImageUrl?.length > 0
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

    // Hash the ballot
    await MerkleTree.getHash(modifiedElection)
      .then((clientHash: Uint8Array) => {
        console.info('clientHash', clientHash);

        DBSubmitBallot(modifiedElection, clientHash)
          .then((res: SubmitBallotModelResponse) => {
            console.info('Success from ballot submission', res);
            setVisible((v: any) => !v);
            navigate('/thanks', { state: res });
          })
          .catch((e: any) => {
            console.error('DBSubmitBallot() - Caught Error from ballot submission', e);

            return e;
          })
          .then((res: SubmitBallotModelResponse) => {
            console.error('DBSubmitBallot() - Processed Error from ballot submission', res);
            setVisible((v: any) => !v);
            errorModal(res.Message);
          });
      })
      .catch((e: any) => {
        console.error('getHash() - Error from ballot submission', e);
        setVisible((v: any) => !v);
        errorModal(e);
      });
  };

  return (
    <Card shadow='sm' p='lg' radius='md' withBorder>
      <LoadingOverlay
        visible={visible}
        overlayBlur={2}
        loaderProps={{ size: 'xl', color: 'green', variant: 'bars' }}
      />
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
      <Box sx={(): any => ({ height: '5px' })}></Box>
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
            <Box sx={(): any => ({ height: '5px' })}></Box>
            {races}
            <Box sx={(): any => ({ height: '5px' })}></Box>
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
  );
};
