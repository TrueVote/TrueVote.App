import { useGlobalContext } from '@/Global';
import { NostrProfile, getNostrPublicKey, getUserProfileInfo } from '@/services/NostrHelper';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  AppShell,
  Avatar,
  Burger,
  Container,
  Group,
  Image,
  Paper,
  Transition,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { FC, useEffect } from 'react';
import { Link, useMatch } from 'react-router-dom';
import { ThemeSwitcher } from '../ThemeSwitcher';

export const AppHeader: FC = () => {
  const nostrPublicKey: string | null = getNostrPublicKey();
  const { nostrProfile, updateNostrProfile } = useGlobalContext();

  useEffect(() => {
    if (nostrPublicKey === null || String(nostrPublicKey).length <= 0) {
      return;
    }
    // Define an async function to fetch the user profile
    const fetchUserProfile: any = async () => {
      try {
        const userProfile: NostrProfile | undefined = await getUserProfileInfo(nostrPublicKey);
        if (userProfile) {
          updateNostrProfile(userProfile);
        }
        console.info('Returned Back', userProfile);
      } catch (error) {
        // Handle any errors, e.g., show an error message
        console.error('Error fetching user profile:', error);
      }
    };

    // Call the async function
    fetchUserProfile();
  });

  const links: any = [
    { id: '0', link: '/ballots', label: 'Ballots', matched: useMatch('/ballots') },
    { id: '1', link: '/elections', label: 'Elections', matched: useMatch('/elections') },
    { id: '2', link: '/profile', label: 'Profile', matched: useMatch('/profile') },
  ];
  const [opened, toggle] = useToggle();

  const items: any = links.map((link: any) => (
    <Link key={link.id} to={link.link} className={classes.link} onClick={(): any => toggle(false)}>
      {link.label}
    </Link>
  ));

  return (
    <AppShell.Header>
      <Container fluid className={classes.header}>
        <Group gap={6} className={classes.headerLeft}>
          <span className={classes.headerLink}>
            <Image className={classes.headerImage} component={Link} to='/' />
          </span>
          <span className={classes.profileLink}>
            <Avatar
              alt='Avatar'
              radius='xl'
              src={nostrProfile?.avatar}
              component={Link}
              to='/profile'
            />
          </span>
        </Group>

        <Group gap={6} className={classes.links}>
          {items}
        </Group>

        <Group gap={6} className={classes.headerRight}>
          <ThemeSwitcher />
          <Burger
            opened={opened}
            onClick={(): any => toggle(true)}
            aria-label='Toggle navigation'
            size='sm'
            className={classes.burger}
          />
        </Group>

        <Transition transition='pop-top-right' duration={200} mounted={opened}>
          {(styles: any): any => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </AppShell.Header>
  );
};
