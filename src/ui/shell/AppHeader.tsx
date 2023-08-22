import {
  Anchor,
  Avatar,
  Burger,
  Container,
  Group,
  Header,
  Image,
  Paper,
  Transition,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { FC } from 'react';
import { Link, useMatch } from 'react-router-dom';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { HEADER_HEIGHT, headerFooterStyles } from './AppStyles';

export const AppHeader: FC = () => {
  const links: any = [
    { id: '0', link: '/', label: 'Home', matched: useMatch('/') },
    { id: '1', link: '/ballots', label: 'Ballots', matched: useMatch('/ballots') },
    { id: '2', link: '/elections', label: 'Elections', matched: useMatch('/elections') },
  ];
  const [opened, toggle] = useToggle();
  const { classes, cx } = headerFooterStyles();

  const items: any = links.map((link: any) => (
    <Link
      key={link.id}
      to={link.link}
      className={cx(classes.link, { [cx(classes.linkActive)]: link.matched })}
      onClick={(): any => toggle(false)}
    >
      {link.label}
    </Link>
  ));

  return (
    <Header height={HEADER_HEIGHT} className={cx(classes.root)}>
      <Container className={cx(classes.header)}>
        <Group spacing={6}>
          <Avatar alt='Avatar' radius='xl' component={Link} to='/profile' />
          <Anchor href='/' className={cx(classes.headerLink)}>
            <Image className={cx(classes.headerImage)}></Image>
          </Anchor>
        </Group>

        <Group spacing={5} className={cx(classes.links)}>
          {items}
        </Group>

        <Group spacing={16}>
          <ThemeSwitcher />
          <Burger
            opened={opened}
            onClick={(): any => toggle()}
            className={cx(classes.burger)}
            aria-label='links dropdown menu'
            size='sm'
          />
        </Group>

        <Transition transition='pop-top-right' duration={200} mounted={opened}>
          {(styles: any): any => (
            <Paper className={cx(classes.dropdown)} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
};
