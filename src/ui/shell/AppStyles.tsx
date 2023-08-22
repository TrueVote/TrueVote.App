import { createStyles } from '@mantine/core';

export const HEADER_HEIGHT: number = 50;

export const headerFooterStyles: any = createStyles((theme: any) => ({
  root: {
    position: 'relative',
    zIndex: 1,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    maxWidth: '100%',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      textDecoration: 'none',
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },

  headerLink: {
    position: 'fixed',
    width: '45px',
    marginLeft: '50px',
  },

  headerImage: {
    height: '45px',
    backgroundSize: '45px',
    backgroundImage:
      theme.colorScheme === 'dark' ? `url('/static/tv01@2x.png')` : `url('/static/tv03@2x.png')`,
  },
}));

export const ballotViewStyles: any = createStyles((theme: any) => ({
  boxGap: {
    height: '15px',
  },
  titleSpaces: {
    paddingTop: '1px',
    paddingBottom: '7px',
  },
  checkboxLabel: {
    label: {
      color: 'lightgreen',
    },
  },
  tdLeft: {
    textAlign: 'right',
  },
  tdFixedWidth: {
    [theme.fn.smallerThan(440)]: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      width: '160px',
    },
  },
  flexGap: {
    padding: '10px',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[0],
  },
  accordion: {
    item: {
      // styles added to expanded item
      '&[data-active]': {
        filter: `brightness(100%)`,
      },
    },

    chevron: {
      '&[data-rotate]': {
        transform: 'rotate(90deg)',
      },
    },

    control: {
      padding: '2px',
    },
  },
  radioBody: {
    paddingBottom: '15px',
  },
  cardWide: {
    width: '100%',
  },
}));

export const linkStyle: any = {
  textDecoration: 'none',
};
