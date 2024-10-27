import { SubmitBallotModelResponse } from '@/TrueVote.Api';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  Button,
  Container,
  Group,
  Image,
  Paper,
  Space,
  Stack,
  Table,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconCheck, IconLink } from '@tabler/icons-react';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Thanks: FC = () => {
  const location: any = useLocation();
  const submitBallotModelResponse: SubmitBallotModelResponse = location.state;

  const ballotId: string = submitBallotModelResponse?.BallotId
    ? submitBallotModelResponse.BallotId
    : '<empty>';

  const electionId: string = submitBallotModelResponse?.ElectionId
    ? submitBallotModelResponse.ElectionId
    : '<empty>';

  return (
    <Container size='sm' className={classes.container}>
      <Stack gap='xl'>
        <Group justify='center' pt='md'>
          <ThemeIcon size='xl' radius='xl' color='green' variant='light'>
            <IconCheck size={32} />
          </ThemeIcon>
        </Group>
        <Stack gap={32} align='center'>
          <Hero title='Thank You for Voting!' />
        </Stack>
        <Stack gap='md' align='center'>
          <Text size='lg' c='gray.3' ta='center'>
            You&apos;ve just taken an important step in shaping our future. Your voice matters, and
            your vote counts.
          </Text>
        </Stack>
        <Paper p='md' radius='md' bg='blue.9' c='gray.0'>
          <Text ta='center'>
            Your ballot has been securely submitted and will be counted in the final tally.
            We&apos;ll notify you once it&apos;s been hashed and verified.
            <br />
            <br />
            Your ballot is forever-immutable and tamper-proof.
          </Text>
        </Paper>
        <Paper p='md' radius='md' withBorder>
          <Stack gap='md'>
            <Text size='sm' c='gray.3' ta='center'>
              Track your ballot with this ID:
            </Text>
            <Button
              component={Link}
              to={`/ballotview/${ballotId}`}
              variant='light'
              rightSection={<IconLink size={16} />}
              fullWidth
            >
              <Text size='sm' ff='monospace'>
                {ballotId}
              </Text>
            </Button>
          </Stack>
          <Space h='md' />
          <Stack gap='md'>
            <Text size='sm' c='gray.3' ta='center'>
              Track the election results with this ID:
            </Text>
            <Button
              component={Link}
              to={`/results/${electionId}`}
              variant='light'
              rightSection={<IconLink size={16} />}
              fullWidth
            >
              <Text size='sm' ff='monospace'>
                {ballotId}
              </Text>
            </Button>
          </Stack>
        </Paper>
        <Table
          verticalSpacing='xs'
          striped={false}
          withTableBorder={false}
          withColumnBorders={false}
          className={classes.table}
        >
          <Table.Tbody>
            <Table.Tr>
              <Table.Td colSpan={2} className={classes.tdCenter}>
                <div className={classes.homeLogoDiv}>
                  <Image radius='md' className={classes.thanksLogoImage} />
                </div>
                <Text className={classes.smallText} />
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        {navigator.share ? (
          <Button
            variant='light'
            color='blue'
            onClick={() => {
              navigator
                .share({
                  title: 'I Voted!',
                  text: 'I just cast my ballot securely with TrueVote. Every vote counts!',
                })
                .catch(console.error);
            }}
          >
            Share That You Voted
          </Button>
        ) : (
          <></>
        )}
      </Stack>
    </Container>
  );
};
