import classes from '@/ui/shell/AppStyles.module.css';
import { Alert, Button } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { FC, JSX, useEffect, useState } from 'react';

interface VersionInfo {
  Branch: string;
  BuildTime: string;
  LastTag: string;
  Commit: string;
}

const VERSION_CHECK_INTERVAL: number = 5 * 60 * 1000; // 5 minutes
const DISMISS_TIMEOUT: number = 4 * 60 * 60 * 1000; // 4 hours

export const VersionChecker: FC = (): JSX.Element => {
  const [newVersionAvailable, setNewVersionAvailable] = useState<boolean>(false);
  const [currentVersion, setCurrentVersion] = useState<string>('');

  const checkForNewVersion = async (): Promise<void> => {
    try {
      if (!currentVersion) {
        const initialResponse: Response = await fetch('/version.json');
        const initialData: VersionInfo = await initialResponse.json();
        setCurrentVersion(initialData.LastTag);
        console.info('Current version:', initialData.LastTag);
        return;
      }

      const response: Response = await fetch('/version.json?' + new Date().getTime());
      const data: VersionInfo = await response.json();

      if (data.LastTag !== currentVersion) {
        console.warn('New version available:', data.LastTag);
        // Check if we're still within the dismiss timeout
        const dismissedUntil = localStorage.getItem('versionDismissedUntil');
        if (!dismissedUntil || new Date().getTime() > parseInt(dismissedUntil)) {
          setNewVersionAvailable(true);
        }
      }
    } catch (error) {
      console.error('Error checking for new version:', error);
    }
  };

  const handleReload = (): void => {
    localStorage.removeItem('versionDismissedUntil');
    window.location.reload();
  };

  const handleDismiss = (): void => {
    // Set a timestamp for when the dismiss period expires
    const dismissUntil = new Date().getTime() + DISMISS_TIMEOUT;
    localStorage.setItem('versionDismissedUntil', dismissUntil.toString());
    setNewVersionAvailable(false);
  };

  useEffect((): (() => void) => {
    const onFocus = (): void => {
      checkForNewVersion();
    };
    window.addEventListener('focus', onFocus);

    const interval: NodeJS.Timeout = setInterval(checkForNewVersion, VERSION_CHECK_INTERVAL);

    checkForNewVersion();

    return (): void => {
      window.removeEventListener('focus', onFocus);
      clearInterval(interval);
    };
  }, [currentVersion]);

  if (!newVersionAvailable) return <></>;

  return (
    <div className={classes.versionCheckerWrapper}>
      <Alert
        icon={<IconInfoCircle size={20} />}
        color='orange'
        radius='md'
        withCloseButton
        onClose={handleDismiss}
        classNames={{
          root: classes.versionCheckerAlert,
          wrapper: classes.versionCheckerAlertWrapper,
          message: classes.versionCheckerMessage,
          closeButton: classes.versionCheckerCloseButton,
        }}
      >
        <div className={classes.versionCheckerContent}>
          New version available
          <Button
            variant='filled'
            color='white'
            size='sm'
            className={classes.versionCheckerButton}
            onClick={handleReload}
          >
            Reload
          </Button>
        </div>
      </Alert>
    </div>
  );
};
