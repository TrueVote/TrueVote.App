import { ElectionModel } from '@/TrueVote.Api';
import { DBAllElections } from '@/services/GraphQLDataClient';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { useApolloClient } from '@apollo/client';
import {
  Accordion,
  Button,
  Container,
  MantineTheme,
  Space,
  Text,
  rem,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconCheckbox, IconChecklist, IconChevronRight, IconSum } from '@tabler/icons-react';
import { FC, Fragment, ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
  const apolloClient = useApolloClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [electionData, setElectionData] = useState<ElectionModel[] | undefined>();

  useEffect(() => {
    const fetchElections = async (): Promise<void> => {
      try {
        const fetchedElections: ElectionModel[] = await DBAllElections(apolloClient);

        setElectionData(fetchedElections);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  if (loading) {
    return <TrueVoteLoader />;
  }

  if (error) {
    console.error(error);
    return <>`Error ${error.message}`</>;
  }
  console.info(electionData);

  if (electionData === null || electionData === undefined || electionData.length === 0) {
    return (
      <Container size='xs' px='xs' className={classes.container}>
        <Text>No Elections Found</Text>
      </Container>
    );
  }
  const elections: ElectionModel[] = electionData;

  const items: any = elections.map(
    (e: ElectionModel, i: number): ReactElement => (
      <Fragment key={i}>
        <Accordion.Item value={i.toString()} key={i}>
          <Accordion.Control key={i} icon={<IconChecklist size={26} color={getColor('orange')} />}>
            <Text>{e.Name}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text>{e.Description}</Text>
            <Link to={`/ballot/${e.ElectionId}`} className={classes.buttonText}>
              <Button
                fullWidth
                radius='md'
                color='green'
                variant='light'
                rightSection={<IconCheckbox style={{ width: rem(16), height: rem(16) }} />}
              >
                <span className={classes.buttonText}>Vote</span>
              </Button>
            </Link>
            <Space h='md' />
            <Link to={`/results/${e.ElectionId}`} className={classes.buttonText}>
              <Button
                fullWidth
                radius='md'
                color='orange'
                variant='light'
                rightSection={<IconSum style={{ width: rem(16), height: rem(16) }} />}
              >
                <span className={classes.buttonText}>Results</span>
              </Button>
            </Link>
          </Accordion.Panel>
        </Accordion.Item>
      </Fragment>
    ),
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
