import { useGlobalContext } from '@/Global';
import { FeedbackModel, SecureString } from '@/TrueVote.Api';
import { DBSaveFeedback } from '@/services/DataClient';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Button, Container, Group, Stack, Text, Textarea } from '@mantine/core';
import { FC, useState } from 'react';

export const Feedback: FC = () => {
  const [feedback, setFeedback] = useState('');
  const [savedFeedback, setSavedFeedback] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const { userModel } = useGlobalContext();

  const submitFeedback: any = async () => {
    console.info('Feedback', feedback);

    setIsClicked(true);
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
      })
      .catch((e: SecureString) => {
        console.error('Error from DBSaveUser', e);
        setSavedFeedback('Error saving feedback: ' + e.Value);
        setTimeout(() => setIsClicked(false), 3000);
      });
  };

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Feedback' />
      </Stack>
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
    </Container>
  );
};
