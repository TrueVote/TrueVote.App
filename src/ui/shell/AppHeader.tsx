import { emptyUserModel, useGlobalContext } from '@/Global';
import { ProtectedNavLink } from '@/RoutingHelper';
import { Localization } from '@/services/Localization';
import { emptyNostrProfile, getNostrNsecFromStorage, nostrSignOut } from '@/services/NostrHelper';
import { jwtSignOut } from '@/services/RESTDataClient';
import { SecureString } from '@/TrueVote.Api';
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
import { signInWithNostr } from '../../pages/SignIn';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { ThemeSwitcher } from '../ThemeSwitcher';

export const AppHeader: FC = () => {
  const nsec: string | null = getNostrNsecFromStorage();
  const { nostrProfile, updateNostrProfile } = useGlobalContext();
  const { updateUserModel } = useGlobalContext();
  const { localization, updateLocalization } = useGlobalContext();
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (localization === undefined) {
      updateLocalization(new Localization());
    }

    if (nsec === null || String(nsec).length <= 0 || fetched) {
      return;
    }

    setFetched(true); // Mark as fetched immediately to avoid multiple calls

    const handleError: any = (e: SecureString): void => {
      console.error('Error from fetchNostrAndUserProfile', e);
      updateNostrProfile(emptyNostrProfile);
      nostrSignOut();
      jwtSignOut();
    };

    // Async function to fetch the user profile
    const fetchNostrAndUserProfile: any = async () => {
      try {
        const { retrievedProfile, npub, res } = await signInWithNostr(nsec, handleError);
        console.info('Returned Back from signInWithNostr()', retrievedProfile, npub, res);
        if (retrievedProfile && retrievedProfile !== undefined) {
          updateNostrProfile(retrievedProfile);
        } else {
          updateNostrProfile(emptyNostrProfile);
          nostrSignOut();
          jwtSignOut();
        }
        if (res?.User && res.User !== undefined) {
          console.info('Updating userModel from AppHeader Load', res.User);
          updateUserModel(res.User);
        } else {
          updateUserModel(emptyUserModel);
        }
      } catch (error) {
        // Handle any errors, e.g., show an error message
        console.error('Error fetching nostrProfile:', error);
        updateNostrProfile(emptyNostrProfile);
        nostrSignOut();
        jwtSignOut();
      }
    };

    // Call the async function
    fetchNostrAndUserProfile();
  }, [fetched, localization, nsec, updateLocalization, updateNostrProfile, updateUserModel]);

  interface LinkType {
    id: string;
    link: string;
    label: string;
    protected: boolean;
    matched: PathMatch<string> | null;
  }

  const links: LinkType[] = [
    {
      id: '0',
      link: '/ballots',
      label: 'My Ballots',
      protected: true,
      matched: useMatch('/ballots'),
    },
    {
      id: '1',
      link: '/elections',
      label: 'Elections',
      protected: false,
      matched: useMatch('/elections'),
    },
    { id: '2', link: '/polls', label: 'Polls', protected: false, matched: useMatch('/polls') },
    {
      id: '3',
      link: '/profile',
      label: 'Profile',
      protected: false,
      matched: useMatch('/profile'),
    },
    { id: '4', link: '/about', label: 'About', protected: false, matched: useMatch('/about') },
  ];
  const [, toggle] = useToggle();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle: any = (): any => {
    setMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu: any = (): any => {
    setMenuOpen(false);
  };

  const items: JSX.Element[] = links.map((link: LinkType) =>
    link.protected ? (
      <ProtectedNavLink
        key={link.id}
        to={link.link}
        className={classes.link}
        onClick={(): void => toggle(false)}
      >
        {link.label}
      </ProtectedNavLink>
    ) : (
      <NavLink
        key={link.id}
        to={link.link}
        className={classes.link}
        onClick={(): void => toggle(false)}
      >
        {link.label}
      </NavLink>
    ),
  );

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
