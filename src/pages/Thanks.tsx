import { SubmitBallotModelResponse } from '@/TrueVote.Api';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  Button,
  Container,
  Group,
  Image,
  Paper,
  Stack,
  Table,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconCheck, IconLink, IconShare } from '@tabler/icons-react';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import thanksclasses from './Thanks.module.css';

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
        <Group justify='center' pt='md'>
          <ThemeIcon size='xl' radius='xl' className={thanksclasses.checkIcon}>
            <IconCheck size={32} />
          </ThemeIcon>
        </Group>
        <Stack gap={32} align='center'>
          <Hero title='Thank You for Voting!' />
        </Stack>
        <Stack gap='md' align='center'>
          <Text size='lg' className={thanksclasses.mainText} ta='center'>
            You&apos;ve just taken an important step in shaping our future. Your voice matters, and
            your vote counts.
          </Text>
        </Stack>
        <Paper p='md' radius='md' className={thanksclasses.confirmationBox}>
          <Text ta='center' fw={500}>
            Your ballot has been securely submitted and will be counted in the final tally.
            We&apos;ll notify you once it&apos;s been hashed and verified.
            <br />
            <br />
            Your ballot is forever-immutable and tamper-proof.
          </Text>
        </Paper>
        <Paper p='xl' radius='md' withBorder className={thanksclasses.trackingBox}>
          <Stack gap='xl'>
            <Stack gap='md'>
              <Text size='sm' className={thanksclasses.labelText} ta='center' fw={500}>
                Track your ballot with this ID:
              </Text>
              <Button
                component={Link}
                to={`/ballotview/${ballotId}`}
                className={thanksclasses.trackingButton}
                rightSection={<IconLink size={16} />}
                fullWidth
                size='md'
              >
                <Text size='sm' ff='monospace'>
                  {ballotId}
                </Text>
              </Button>
            </Stack>
            <Stack gap='md'>
              <Text size='sm' className={thanksclasses.labelText} ta='center' fw={500}>
                Track the election results with this ID:
              </Text>
              <Button
                component={Link}
                to={`/results/${electionId}`}
                className={thanksclasses.trackingButton}
                rightSection={<IconLink size={16} />}
                fullWidth
                size='md'
              >
                <Text size='sm' ff='monospace'>
                  {electionId}
                </Text>
              </Button>
            </Stack>
          </Stack>
        </Paper>
        {navigator.share && (
          <Button
            className={thanksclasses.shareButton}
            size='lg'
            fullWidth
            leftSection={<IconShare size={20} />}
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
        )}
      </Stack>
    </Container>
  );
};
