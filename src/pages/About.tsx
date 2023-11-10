import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Anchor, Container, Group, Space, Stack, Text } from '@mantine/core';
import { FC } from 'react';

export const About: FC = () => {
  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='About' />
      </Stack>
      <Text>
        The TrueVote platform is brought to you with love from TrueVote, LLC. We strive to
        revolutionize the democratic process by providing a secure, transparent, and user-friendly
        voting experience. Committed to fostering trust and inclusivity, we empower individuals
        worldwide to actively participate in shaping their communities.
      </Text>
      <Space h='md'></Space>
      <Text>
        TrueVote is not just an app; it's a commitment to the principles of democracy, innovation,
        and a brighter future for all. With support for multiple languages, we ensure accessibility
        on a global scale, transcending borders and making democratic participation a universal
        right. Join us on this journey as we pave the way for a more accessible and accountable
        electoral landscape for the entire world.
      </Text>
      <Space h='md'></Space>
      <Space h='md'></Space>
      <Group>
        <Anchor href='//truevote.org' className={classes.linkNoPadding} target='_blank'>
          <Text size={'md'}>Visit us at TrueVote.org to learn more about our mission.</Text>
        </Anchor>
      </Group>
    </Container>
  );
};
