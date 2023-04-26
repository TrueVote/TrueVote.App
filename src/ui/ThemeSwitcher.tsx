import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { FC } from 'react';
import { Icon } from './Icons/Icon';

export const ThemeSwitcher: FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <ActionIcon onClick={(): void => toggleColorScheme()} aria-label='switch theme button'>
      <Icon icon={colorScheme === 'dark' ? 'sun' : 'moon'} />
    </ActionIcon>
  );
};
