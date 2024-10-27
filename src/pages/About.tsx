import { ProtectedLink } from '@/RoutingHelper';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from '@mantine/core';
import {
  IconBrandGithub,
  IconClick,
  IconCurrencyBitcoin,
  IconDashboard,
  IconDatabase,
  IconExternalLink,
  IconHeart,
  IconLanguage,
  IconLock,
  IconUserCircle,
} from '@tabler/icons-react';
import { FC } from 'react';

const features = [
  {
    icon: IconCurrencyBitcoin,
    title: 'Secured by Bitcoin',
    description:
      'Data is hashed into the Bitcoin blockchain, assuring each vote cannot be altered – forever immutable.',
  },
  {
    icon: IconUserCircle,
    title: 'Voter Accounts',
    description:
      'Each voter has an account on TrueVote. For each election, eligibility is determined by jurisdiction and registration status.',
  },
  {
    icon: IconDashboard,
    title: 'Election Administration Portal (EAP)',
    description: 'Configurable portal to create and maintain each election and ballot',
  },
  {
    icon: IconLock,
    title: 'Data Privacy',
    description:
      'All voting data is anonymized and unlinked. Only voters can see their name associated with a ballot.',
  },
  {
    icon: IconDatabase,
    title: 'Data Availability',
    description:
      'All non-user identifiable data is downloadable for reporting, auditing, and analysis.',
  },
  {
    icon: IconBrandGithub,
    title: 'Open and Transparent',
    description:
      'All core TrueVote code is Open Source on GitHub, MIT license. Community contributions welcome.',
  },
  {
    icon: IconClick,
    title: 'Easy to Use',
    description: 'Using the TrueVote app is as simple as filling out an online survey.',
  },
  {
    icon: IconLanguage,
    title: 'Multilingual',
    description:
      'TrueVote is a worldwide service. Support for many languages is part of the core product.',
  },
];

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

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='lg'>
          {features.map((feature) => (
            <Paper key={feature.title} p='md' radius='md' withBorder>
              <Group wrap='nowrap' gap='md'>
                <ThemeIcon
                  size={40}
                  radius='md'
                  variant='light'
                  style={{ backgroundColor: `${primaryGreen}20` }}
                >
                  <feature.icon
                    style={{
                      width: rem(24),
                      height: rem(24),
                      color: primaryGreen,
                    }}
                  />
                </ThemeIcon>
                <div>
                  <Text size='lg' fw={500} mb={4}>
                    {feature.title}
                  </Text>
                  <Text size='sm' c='dimmed'>
                    {feature.description}
                  </Text>
                </div>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>

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
