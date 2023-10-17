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
import { useColorScheme, useLocalStorage, useToggle } from '@mantine/hooks';
import { FC } from 'react';
import { Link, useMatch } from 'react-router-dom';
import { ThemeSwitcher } from '../ThemeSwitcher';

export const AppHeader: FC = () => {
  const defaultColorScheme: string = useColorScheme();

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'color-scheme',
    defaultValue: defaultColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme: () => void = () => {
    const val: string = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(val);
  };

  const links: any = [
    { id: '0', link: '/ballots', label: 'Ballots', matched: useMatch('/ballots') },
    { id: '1', link: '/elections', label: 'Elections', matched: useMatch('/elections') },
  ];
  const [opened, toggle] = useToggle();

  const items: any = links.map((link: any) => (
    <Link key={link.id} to={link.link} className={classes.link} onClick={(): any => toggle(false)}>
      {link.label}
    </Link>
  ));

  return (
    <AppShell.Header>
      <Container className={classes.header}>
        <Group gap={6}>
          <Avatar alt='Avatar' radius='xl' component={Link} to='/profile' />
          <Anchor href='/' className={classes.headerLink}>
            <Image className={classes.headerImage}></Image>
          </Anchor>
        </Group>

        <Group gap={5} className={classes.links}>
          {items}
        </Group>

        <Group gap={16}>
          <ThemeSwitcher />
          <Burger
            opened={opened}
            onClick={(): any => toggleColorScheme()}
            className={classes.burger}
            aria-label='links dropdown menu'
            size='sm'
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
