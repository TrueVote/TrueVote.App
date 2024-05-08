import { useGlobalContext } from '@/Global';
import { FeedbackModel, SecureString } from '@/TrueVote.Api';
import { DBSaveFeedback } from '@/services/DataClient';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Button, Container, Group, Space, Stack, Text, Textarea } from '@mantine/core';
import { FC, useState } from 'react';

export const Feedback: FC = () => {
  const [feedback, setFeedback] = useState('');
  const [savedFeedback, setSavedFeedback] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const { userModel } = useGlobalContext();
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  const submitFeedback: any = async () => {
    console.info('Feedback', feedback);

    setIsClicked(true);
    setVisible((v: boolean) => !v);
    setSavedFeedback('Submitting Feedback');

    const feedbackModel: FeedbackModel = {
      FeedbackId: '1234567890', // Placeholder
      UserId: userModel && userModel.UserId ? userModel.UserId : '',
      DateCreated: '01/01/1970 12:00:00', // Placeholder
      Feedback: feedback,
    };

    DBSaveFeedback(feedbackModel)
      .then((res: SecureString) => {
        console.info('DBSaveFeedback', res);
        setSavedFeedback('Feedback Submitted');
        setTimeout(() => setIsClicked(false), 3000);
        setVisible((v: boolean) => !v);
        setTimeout(() => setDone((d: boolean) => !d), 1000);
      })
      .catch((e: SecureString) => {
        console.error('Error from DBSaveUser', e);
        setSavedFeedback('Error saving feedback: ' + e.Value);
        setTimeout(() => setIsClicked(false), 3000);
        setVisible((v: boolean) => !v);
      });
  };

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Feedback' />
      </Stack>
      <TrueVoteLoader visible={visible} />
      {done ? (
        <>
          <Text>Thank you for your feedback!</Text>
        </>
      ) : (
        <>
          <Space h='md'></Space>
          <Text>We welcome all feedback. Please add your thoughts below.</Text>
          <Space h='md'></Space>
          <Textarea
            autosize
            minRows={4}
            maxRows={8}
            maxLength={1024}
            placeholder='Feedback'
            value={feedback}
            onChange={(event) => setFeedback(event.currentTarget.value)}
          ></Textarea>
          <Group>
            <Button
              variant='light'
              color='blue'
              mt='md'
              radius='md'
              onClick={(): void => submitFeedback()}
            >
              Submit Feedback
            </Button>
            <Text>{isClicked ? savedFeedback : ''}</Text>
          </Group>
        </>
      )}
    </Container>
  );
};
