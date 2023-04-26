import { createStyles, MantineTheme } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';

const useStyles: any = createStyles((theme: MantineTheme) => ({
  highlight: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.55)
        : theme.colors[theme.primaryColor][1],
    borderRadius: theme.radius.sm,
    padding: '4px 12px',
  },
}));

export const Highlight: FC = (props: PropsWithChildren) => {
  const { classes } = useStyles();
  return <span className={classes.highlight}>{props.children}</span>;
};
