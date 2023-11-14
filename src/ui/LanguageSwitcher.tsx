import classes from '@/ui/shell/AppStyles.module.css';
import { ActionIcon, Menu, rem } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';

export const LanguageSwitcher: FC = () => {
  return (
    <Menu shadow='md' width={120}>
      <Menu.Target>
        <ActionIcon
          className={classes.languageMenu}
          aria-label='Language Selection'
          variant='transparent'
          color='gray'
        >
          <IconLanguage />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Select Language</Menu.Label>
        <Menu.Item leftSection={<IconLanguage style={{ width: rem(14), height: rem(14) }} />}>
          English
        </Menu.Item>
        <Menu.Item leftSection={<IconLanguage style={{ width: rem(14), height: rem(14) }} />}>
          Español
        </Menu.Item>
        <Menu.Item leftSection={<IconLanguage style={{ width: rem(14), height: rem(14) }} />}>
          Français
        </Menu.Item>
        <Menu.Item leftSection={<IconLanguage style={{ width: rem(14), height: rem(14) }} />}>
          Русский
        </Menu.Item>
        <Menu.Item leftSection={<IconLanguage style={{ width: rem(14), height: rem(14) }} />}>
          中文
        </Menu.Item>
        <Menu.Item leftSection={<IconLanguage style={{ width: rem(14), height: rem(14) }} />}>
          العربية
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
