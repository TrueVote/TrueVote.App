import { ProtectedLink } from '@/RoutingHelper';
import { CompanyMissionBullets } from '@/ui/CompanyMissionBullets';
import classes from '@/ui/shell/AppStyles.module.css';
import { Anchor, Button, Container, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconExternalLink, IconHeart } from '@tabler/icons-react';
import { FC } from 'react';

export const About: FC = () => {
  // TrueVote brand colors
  const primaryBlue = '#7793d8';
  const primaryGreen = '#34a26b';

  return (
    <Container size='sm' className={classes.container}>
      <Stack gap='xl'>
        <Stack gap='md' align='center' mt='xl'>
          <ThemeIcon size={80} radius={40} style={{ backgroundColor: primaryGreen }}>
            <IconHeart size={40} style={{ color: 'white' }} />
          </ThemeIcon>
          <Text size='xl' fw={700} ta='center' mt='md'>
            Revolutionizing Democracy Through Technology
          </Text>
        </Stack>

        <Paper p='xl' radius='md' style={{ backgroundColor: primaryBlue }} c='gray.0'>
          <Text size='lg' ta='center'>
            The TrueVote platform is brought to you with love from TrueVote, LLC. We strive to
            revolutionize the voting process by providing a secure, transparent, and user-friendly
            experience.
          </Text>
        </Paper>
        <CompanyMissionBullets />
        <Paper p='xl' radius='md' style={{ backgroundColor: primaryBlue }} c='gray.0'>
          <Text size='lg' ta='center'>
            TrueVote is not just an app; it&apos;s a commitment to the principles of fairness,
            innovation, and a brighter future for all. With support for multiple languages, we
            ensure accessibility on a global scale, transcending borders and making participation a
            universal right.
          </Text>
        </Paper>

        <Stack gap='xs' align='stretch'>
          <Anchor
            href='//truevote.org'
            className={classes.linkNoPadding}
            target='_blank'
            style={{ textDecoration: 'none' }}
          >
            <Button
              variant='subtle'
              style={{ color: primaryBlue }}
              rightSection={<IconExternalLink size={16} />}
              size='lg'
              fullWidth
            >
              Visit TrueVote.org
            </Button>
          </Anchor>

          <ProtectedLink to='/feedback' className={classes.buttonText}>
            <Button
              variant='light'
              style={{
                backgroundColor: `${primaryGreen}20`,
                color: primaryGreen,
                width: '100%',
              }}
              size='lg'
            >
              Submit Feedback
            </Button>
          </ProtectedLink>
        </Stack>
      </Stack>
    </Container>
  );
};
