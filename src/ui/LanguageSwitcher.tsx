import { useGlobalContext } from '@/Global';
import { LanguageLocalization, storeLanguage } from '@/services/Language.localization';
import classes from '@/ui/shell/AppStyles.module.css';
import { ActionIcon, Menu } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import { FC } from 'react';

export const LanguageSwitcher: FC = () => {
  const { updateLocalization } = useGlobalContext();

  const handleMenuItemClick: any = (value: string) => {
    console.info(`Language: ${value}`);
    storeLanguage(value);
    updateLocalization(new LanguageLocalization());
  };

  const languages: any = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'ru', label: 'Русский' },
    { value: 'zh', label: '中文' },
    { value: 'ar', label: 'العربية' },
  ];
  return (
    <Menu shadow='md' width={100}>
      <Menu.Target>
        <ActionIcon
          className={classes.languageMenu}
          aria-label='Language'
          variant='transparent'
          color='gray'
        >
          <IconLanguage />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Language</Menu.Label>
        {languages.map((item: any) => (
          <Menu.Item
            key={item.value}
            value={item.value}
            onClick={() => handleMenuItemClick(item.value)}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
