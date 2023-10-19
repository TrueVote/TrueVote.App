import { BallotModel } from '@/TrueVote.Api';
import { DBAllBallots } from '@/services/DataClient';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Accordion, Button, Container, MantineTheme, Text, useMantineTheme } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { IconChecklist, IconChevronRight, IconZoomIn } from '@tabler/icons-react';
import moment from 'moment';
import { FC, Fragment, ReactElement } from 'react';
import { Link } from 'react-router-dom';

export const Ballots: FC = () => {
  const theme: MantineTheme = useMantineTheme();

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Hero title='Ballots' />
      <AllBallots theme={theme} />
    </Container>
  );
};

export const AllBallots: any = ({ theme }: { theme: MantineTheme }) => {
  const colorScheme: 'dark' | 'light' = useColorScheme();
  const { loading, error, data } = DBAllBallots();
  if (loading) {
    return <TrueVoteLoader />;
  }
  if (error) {
    console.error(error);
    return <>`Error ${error.message}`</>;
  }
  console.info(data);

  const getColor: any = (color: string) => theme.colors[color][colorScheme === 'dark' ? 5 : 7];

  const items: any = data!.GetBallot.Ballots.map(
    (e: BallotModel, i: number): ReactElement => (
      <Fragment key={i}>
        <Accordion.Item value={i.toString()} key={i}>
          <Accordion.Control key={i} icon={<IconChecklist size={26} color={getColor('orange')} />}>
            {moment(e.DateCreated).format('MMMM DD, YYYY')}
          </Accordion.Control>
          <Accordion.Panel>
            <Text>{e.BallotId}</Text>
            <Link to={`/ballotview/${e.BallotId}`} className={classes.linkStyle}>
              <Button radius='md' fullWidth size='compact-md' color='green' variant='light'>
                <IconZoomIn size={16}>Details</IconZoomIn>
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
