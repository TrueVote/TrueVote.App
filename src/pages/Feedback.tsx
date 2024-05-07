import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Button, Container, Group, Stack, Textarea } from '@mantine/core';
import { FC, useState } from 'react';

export const Feedback: FC = () => {
  const [feedback, setFeedback] = useState('');

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Feedback' />
      </Stack>
      <Textarea
        autosize
        minRows={4}
        maxRows={8}
        placeholder='Feedback'
        value={feedback}
        onChange={(event) => setFeedback(event.currentTarget.value)}
      ></Textarea>
      <Group>
        <Button variant='light' color='blue' mt='md' radius='md'>
          Submit Feedback
        </Button>
      </Group>
    </Container>
  );
};
