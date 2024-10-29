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
  Box,
  Burger,
  Container,
  Group,
  Image,
  MantineStyleProp,
  Paper,
  Transition,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import {
  IconBox,
  IconChartBar,
  IconClipboardList,
  IconInfoCircle,
  IconUser,
} from '@tabler/icons-react';
import { FC, useEffect, useRef, useState } from 'react';
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
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      // Check if the click was outside both the menu and the burger button
      if (
        menuRef.current &&
        burgerRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !burgerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    // Add event listener when menu is open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

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
    icon: any;
  }

  const links: LinkType[] = [
    {
      id: '0',
      link: '/ballots',
      label: 'My Ballots',
      protected: true,
      matched: useMatch('/ballots'),
      icon: IconClipboardList,
    },
    {
      id: '1',
      link: '/elections',
      label: 'Elections',
      protected: false,
      matched: useMatch('/elections'),
      icon: IconBox,
    },
    {
      id: '2',
      link: '/polls',
      label: 'Polls',
      protected: false,
      matched: useMatch('/polls'),
      icon: IconChartBar,
    },
    {
      id: '3',
      link: '/profile',
      label: 'Profile',
      protected: false,
      matched: useMatch('/profile'),
      icon: IconUser,
    },
    {
      id: '4',
      link: '/about',
      label: 'About',
      protected: false,
      matched: useMatch('/about'),
      icon: IconInfoCircle,
    },
  ];
  const [, toggle] = useToggle();

  const handleMenuToggle = (): void => {
    setMenuOpen(!isMenuOpen);
  };

  const renderMenuItem = (link: LinkType): JSX.Element => {
    const Icon = link.icon;
    const commonProps = {
      to: link.link,
      className: `${classes.link} inline-flex items-center relative`,
      onClick: (): void => {
        toggle(false);
        setMenuOpen(false);
      },
    };

    const iconElement = (
      <Icon size={24} stroke={1.5} className='flex-shrink-0' style={{ marginRight: '8px' }} />
    );

    if (link.protected) {
      return (
        <ProtectedNavLink key={link.id} {...commonProps}>
          {iconElement}
          <span style={{ position: 'relative', top: '-6px' }}>{link.label}</span>
        </ProtectedNavLink>
      );
    }

    return (
      <NavLink
        key={link.id}
        {...commonProps}
        className={({ isActive }: { isActive: boolean }) => `
          ${commonProps.className}
          ${isActive ? classes.linkActive : ''}
        `}
      >
        {iconElement}
        <span style={{ position: 'relative', top: '-6px' }}>{link.label}</span>
      </NavLink>
    );
  };
  const items: JSX.Element[] = links.map(renderMenuItem);

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
            ref={burgerRef}
          />
        </Group>

        <Transition transition='pop-top-right' duration={200} mounted={isMenuOpen}>
          {(styles: MantineStyleProp): JSX.Element => (
            <Paper
              ref={menuRef}
              className={`${classes.dropdown} bg-white dark:bg-gray-900 shadow-lg`}
              withBorder
              style={styles}
            >
              <Box className='p-2 space-y-1'>{items}</Box>
            </Paper>
          )}
        </Transition>
      </Container>
    </AppShell.Header>
  );
};
