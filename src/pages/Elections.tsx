import { ElectionModel } from '@/TrueVote.Api';
import { DBAllElections } from '@/services/GraphQLDataClient';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  Accordion,
  Button,
  Container,
  MantineTheme,
  Text,
  rem,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconCheckbox, IconChecklist, IconChevronRight } from '@tabler/icons-react';
import { FC, Fragment, ReactElement } from 'react';
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
  const { loading, error, data } = DBAllElections();
  if (loading) {
    return <TrueVoteLoader />;
  }
  if (error) {
    console.error(error);
    return <>`Error ${error.message}`</>;
  }
  console.info(data);

  const getColor: any = (color: string) => theme.colors[color][colorScheme === 'dark' ? 5 : 7];

  const items: any = data!.GetElection.map(
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
