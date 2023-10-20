import classes from '@/ui/shell/AppStyles.module.css';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { FC } from 'react';

export const ThemeSwitcher: FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <ActionIcon
      className={classes.themeSwitcher}
      onClick={(): void => toggleColorScheme()}
      aria-label='Switch Theme Button'
      variant='transparent'
      color={colorScheme === 'dark' ? 'white' : 'gray'}
    >
      {colorScheme === 'dark' ? <IconSun /> : <IconMoon />}
    </ActionIcon>
  );
};
