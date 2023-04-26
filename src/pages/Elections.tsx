import { DBAllElections } from '@/services/DataClient';
import { ElectionModel } from '@/TrueVote.Api';
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
import { IconCheckbox, IconChecklist, IconChevronRight } from '@tabler/icons-react';
import { FC, Fragment, ReactElement } from 'react';
import { Link } from 'react-router-dom';

export const Elections: FC = () => {
  const theme: MantineTheme = useMantineTheme();

  return (
    <Container size='xs' px='xs'>
      <Stack spacing={32}>
        <Hero title='Elections' />
      </Stack>
      <AllElections theme={theme} />
    </Container>
  );
};

const AllElections: any = ({ theme }: { theme: MantineTheme }) => {
  const { loading, error, data } = DBAllElections();
  if (loading) return <>Loading Elections...</>;
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

  const items: any = data.GetElection.map(
    (e: ElectionModel, i: number): ReactElement => (
      <Fragment key={i}>
        <Accordion.Item value={i.toString()} key={i}>
          <Accordion.Control key={i} icon={<IconChecklist size={20} color={getColor('orange')} />}>
            {e.Name}
          </Accordion.Control>
          <Accordion.Panel>
            {e.Description}
            <Flex>
              <Link to={`/ballot/${e.ElectionId}`}>
                <Button
                  radius='md'
                  styles={buttonStyle}
                  compact
                  color='green'
                  leftIcon={<IconCheckbox size={16} />}
                  variant='light'
                >
                  Vote
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
