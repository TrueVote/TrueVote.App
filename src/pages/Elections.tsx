import { useGlobalContext } from '@/Global';
import { ElectionModel } from '@/TrueVote.Api';
import { BallotBinderStorage } from '@/services/BallotBinder';
import { allElectionsQuery } from '@/services/GraphQLSchemas';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { ElectionList } from '@/ui/ElectionList';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { useQuery } from '@apollo/client';
import {
  Accordion,
  Container,
  MantineTheme,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';

export const Elections: FC = () => {
  const theme: MantineTheme = useMantineTheme();

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Hero title='Elections' />
      <AllElections theme={theme} />
    </Container>
  );
};

const AllElections: any = ({ theme }: { theme: MantineTheme }) => {
  const { colorScheme } = useMantineColorScheme();
  const getColor: any = (color: string) => theme.colors[color][colorScheme === 'dark' ? 5 : 7];
  const [electionsDetails, setElectionsDetails] = useState<ElectionModel[] | undefined>();
  const { userModel } = useGlobalContext();

  const {
    loading: electionsLoading,
    error: electionsError,
    data: electionsData,
  } = useQuery(allElectionsQuery, {
    onCompleted: (data) => {
      console.info('Elections query completed:', data);
    },
    onError: (error) => {
      console.error('Elections query error:', error);
    },
  });

  // Update state when query data is received
  useEffect(() => {
    if (electionsData?.GetElection) {
      console.info('Updating elections from query');
      setElectionsDetails(electionsData.GetElection);
    }
  }, [electionsData]);

  if (electionsLoading) {
    return <TrueVoteLoader />;
  }

  if (electionsError) {
    console.error(electionsError);
    return <>`Error ${electionsError.message}`</>;
  }

  if (
    electionsDetails === null ||
    electionsDetails === undefined ||
    electionsDetails.length === 0
  ) {
    return (
      <Container size='xs' px='xs' className={classes.container}>
        <Text>No Elections Found</Text>
      </Container>
    );
  }

  const elections: ElectionModel[] = electionsDetails;

  let ballotBinderStorage: BallotBinderStorage | undefined = undefined;
  if (userModel) {
    ballotBinderStorage = new BallotBinderStorage(userModel.UserId);
  }

  const items: any = (
    <ElectionList elections={elections} ballotBinderStorage={ballotBinderStorage} />
  );

  return (
    <>
      <Accordion
        chevronPosition='right'
        variant='contained'
        chevron={<IconChevronRight size={26} />}
        className={classes.accordion}
      >
        {items}
      </Accordion>
    </>
  );
};
