import { useGlobalContext } from '@/Global';
import { Localization } from '@/services/Localization';
import {
  emptyNostrProfile,
  getNostrNpubFromStorage,
  getNostrProfileInfo,
  NostrProfile,
  nostrSignOut,
} from '@/services/NostrHelper';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  AppShell,
  Avatar,
  Burger,
  Container,
  Group,
  Image,
  MantineStyleProp,
  Paper,
  Transition,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { FC, useEffect, useState } from 'react';
import { Link, NavLink, PathMatch, useMatch } from 'react-router-dom';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { ThemeSwitcher } from '../ThemeSwitcher';

export const AppHeader: FC = () => {
  const npub: string | null = getNostrNpubFromStorage();
  const { nostrProfile, updateNostrProfile } = useGlobalContext();
  const { localization, updateLocalization } = useGlobalContext();

  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (localization === undefined) {
      updateLocalization(new Localization());
    }

    if (npub === null || String(npub).length <= 0 || fetched) {
      return;
    }

    setFetched(true); // Mark as fetched immediately to avoid multiple calls

    // Async function to fetch the user profile
    const fetchNostrProfile: any = async () => {
      try {
        const nostrProfile: NostrProfile | undefined = await getNostrProfileInfo(npub);
        console.info('Returned Back from getNostrProfileInfo()', nostrProfile);
        if (nostrProfile && nostrProfile !== undefined) {
          updateNostrProfile(nostrProfile);
        } else {
          updateNostrProfile(emptyNostrProfile);
          nostrSignOut();
        }
      } catch (error) {
        // Handle any errors, e.g., show an error message
        console.error('Error fetching nostrProfile:', error);
        updateNostrProfile(emptyNostrProfile);
        nostrSignOut();
      }
    };

    // Call the async function
    fetchNostrProfile();
  }, [fetched, localization, npub, updateLocalization, updateNostrProfile]);

  interface LinkType {
    id: string;
    link: string;
    label: string;
    matched: PathMatch<string> | null;
  }

  const links: LinkType[] = [
    { id: '0', link: '/ballots', label: 'Ballots', matched: useMatch('/ballots') },
    { id: '1', link: '/elections', label: 'Elections', matched: useMatch('/elections') },
    { id: '2', link: '/polls', label: 'Polls', matched: useMatch('/polls') },
    { id: '3', link: '/profile', label: 'Profile', matched: useMatch('/profile') },
    { id: '4', link: '/results', label: 'Results', matched: useMatch('/results') },
    { id: '5', link: '/about', label: 'About', matched: useMatch('/about') },
  ];
  const [, toggle] = useToggle();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle: any = (): any => {
    setMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu: any = (): any => {
    setMenuOpen(false);
  };

  const items: JSX.Element[] = links.map((link: LinkType) => (
    <NavLink
      key={link.id}
      to={link.link}
      className={classes.link}
      onClick={(): void => toggle(false)}
    >
      {link.label}
    </NavLink>
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
              src={nostrProfile?.picture}
              className={classes.avatarImage}
              component={Link}
              to='/profile'
            />
          </span>
        </Group>

        <Group gap={6} className={classes.links}>
          {items}
        </Group>

        <Group gap={6} className={classes.headerRight}>
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Burger
            opened={isMenuOpen}
            onClick={handleMenuToggle}
            aria-label='Toggle navigation'
            size='sm'
            className={classes.burger}
          />
        </Group>

        <Transition transition='pop-top-right' duration={200} mounted={isMenuOpen}>
          {(styles: MantineStyleProp): JSX.Element => (
            <Paper className={classes.dropdown} withBorder style={styles} onClick={handleCloseMenu}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </AppShell.Header>
  );
};
