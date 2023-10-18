import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { FC } from 'react';

export const ThemeSwitcher: FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <ActionIcon
      onClick={(): void => toggleColorScheme()}
      aria-label='Switch Theme Button'
      variant='transparent'
      color={colorScheme == 'dark' ? 'white' : 'gray'}
    >
      {colorScheme == 'dark' ? <IconSun /> : <IconMoon />}
    </ActionIcon>
  );
};
