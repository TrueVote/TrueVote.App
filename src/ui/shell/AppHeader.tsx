import classes from '@/ui/shell/AppStyles.module.css';
import {
  Anchor,
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
import { FC } from 'react';
import { Link, useMatch } from 'react-router-dom';
import { ThemeSwitcher } from '../ThemeSwitcher';

export const AppHeader: FC = () => {
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
          <Anchor href='/profile' className={classes.profileLink}>
            <Avatar alt='Avatar' radius='xl' component={Link} to='/profile' />
          </Anchor>
          <Anchor href='/' className={classes.headerLink}>
            <Image className={classes.headerImage} component={Link} to='/' />
          </Anchor>
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
