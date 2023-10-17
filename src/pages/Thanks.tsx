import { SubmitBallotModelResponse } from '@/TrueVote.Api';
import { Hero } from '@/ui/Hero';
import { Container, Stack, Text } from '@mantine/core';
import { FC } from 'react';
import { useLocation } from 'react-router-dom';

export const Thanks: FC = () => {
  const location: any = useLocation();

  const submitBallotModelResponse: SubmitBallotModelResponse = location.state;

  console.info('Thanks Data', submitBallotModelResponse);

  return (
    <Container size='xs' px='xs'>
      <Stack gap={32}>
        <Hero title='Thanks!' />
        <Text size='xl'>Thank you for submitting your ballot.</Text>
        <Text>{submitBallotModelResponse.Message}</Text>
        <Text>You will receive a notification once your ballot has been validated!</Text>
      </Stack>
    </Container>
  );
};
