import { Group, Paper, rem, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import {
  IconBrandGithub,
  IconClick,
  IconCurrencyBitcoin,
  IconDashboard,
  IconDatabase,
  IconLanguage,
  IconLock,
  IconUserCircle,
} from '@tabler/icons-react';
import { JSX } from 'react';

export const CompanyMissionBullets = (): JSX.Element => {
  const primaryGreen = '#34a26b';

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

  return (
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
  );
};
