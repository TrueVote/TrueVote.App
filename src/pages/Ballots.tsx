import { DBAllBallots } from '@/services/DataClient';
import { BallotModel } from '@/TrueVote.Api';
import { Hero } from '@/ui/Hero';
import {
  Accordion,
  Button,
  Container,
  Flex,
  MantineTheme,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import { IconChecklist, IconChevronRight, IconZoomIn } from '@tabler/icons-react';
import moment from 'moment';
import { FC, Fragment, ReactElement } from 'react';
import { Link } from 'react-router-dom';

export const Ballots: FC = () => {
  const theme: MantineTheme = useMantineTheme();

  return (
    <Container size='xs' px='xs'>
      <Stack spacing={32}>
        <Hero title='Ballots' />
      </Stack>
      <AllBallots theme={theme} />
    </Container>
  );
};

export const AllBallots: any = ({ theme }: { theme: MantineTheme }) => {
  const { loading, error, data } = DBAllBallots();
  if (loading) return <>Loading Ballots...</>;
  if (error) {
    console.error(error);
    return <>`Error ${error.message}`</>;
  }
  console.info(data);

  const buttonStyle: any = () => ({
    root: {
      marginTop: 5,
      marginLeft: -10,
      width: 400,
    },
  });

  const getColor: any = (color: string) =>
    theme.colors[color][theme.colorScheme === 'dark' ? 5 : 7];

  const items: any = data.GetBallot.map(
    (e: BallotModel, i: number): ReactElement => (
      <Fragment key={i}>
        <Accordion.Item value={i.toString()} key={i}>
          <Accordion.Control key={i} icon={<IconChecklist size={20} color={getColor('orange')} />}>
            {moment(e.DateCreated).format('MMMM DD, YYYY')}
          </Accordion.Control>
          <Accordion.Panel>
            {e.BallotId}
            <Flex>
              <Link to={`/ballotview/${e.BallotId}`}>
                <Button
                  radius='md'
                  styles={buttonStyle}
                  compact
                  color='green'
                  leftIcon={<IconZoomIn size={16} />}
                  variant='light'
                >
                  Details
                </Button>
              </Link>
            </Flex>
          </Accordion.Panel>
        </Accordion.Item>
      </Fragment>
    ),
  );

  return (
    <>
      <Accordion
        chevronPosition='right'
        sx={{ maxWidth: 420, minWidth: 420 }}
        chevron={<IconChevronRight size={16} />}
        styles={{
          item: {
            // styles added to expanded item
            '&[data-active]': {
              filter: `brightness(100%)`,
            },
          },

          chevron: {
            '&[data-rotate]': {
              transform: 'rotate(90deg)',
            },
          },
        }}
      >
        {items}
      </Accordion>
    </>
  );
};
