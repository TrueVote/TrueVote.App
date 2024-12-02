import { BallotBinderStorage } from '@/services/BallotBinder';
import { ElectionModel } from '@/TrueVote.Api';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  Accordion,
  Button,
  MantineTheme,
  rem,
  Space,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconCheckbox, IconChecklist, IconMailSpark, IconSum } from '@tabler/icons-react';
import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

export const ElectionList: FC<{
  elections: ElectionModel[];
  ballotBinderStorage?: BallotBinderStorage;
}> = ({ elections, ballotBinderStorage }): JSX.Element => {
  const theme: MantineTheme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const getColor: any = (color: string) => theme.colors[color][colorScheme === 'dark' ? 5 : 7];

  const items: any = elections.map(
    (e: ElectionModel, i: number): ReactElement => (
      <Fragment key={i}>
        <Accordion.Item value={i.toString()} key={i}>
          <Accordion.Control
            key={i}
            icon={
              <IconChecklist
                size={26}
                color={getColor(
                  ballotBinderStorage &&
                    ballotBinderStorage.getBallotBinderbyElectionId(e.ElectionId)
                    ? 'green'
                    : 'orange',
                )}
              />
            }
          >
            <Text>{e.Name}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text>{e.Description}</Text>
            {ballotBinderStorage &&
            ballotBinderStorage.getBallotBinderbyElectionId(e.ElectionId) ? (
              <Link
                to={`/ballotview/${ballotBinderStorage.getBallotBinderbyElectionId(e.ElectionId)?.BallotId}`}
                className={classes.buttonText}
              >
                <Button
                  fullWidth
                  radius='md'
                  color='green'
                  variant='light'
                  rightSection={<IconMailSpark style={{ width: rem(16), height: rem(16) }} />}
                >
                  <span className={classes.buttonText}>My Ballot</span>
                </Button>
              </Link>
            ) : (
              <Link to={`/ballot/${e.ElectionId}`} className={classes.buttonText}>
                <Button
                  fullWidth
                  radius='md'
                  color={new Date().toISOString() > e.EndDate ? 'blue' : 'green'}
                  variant='light'
                  rightSection={<IconCheckbox style={{ width: rem(16), height: rem(16) }} />}
                >
                  <span className={classes.buttonText}>
                    {new Date().toISOString() > e.EndDate ? 'View Ballot' : 'Vote'}
                  </span>
                </Button>
              </Link>
            )}
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

  return items;
};
