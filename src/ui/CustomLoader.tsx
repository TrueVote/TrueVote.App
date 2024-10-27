import classes from '@/ui/shell/AppStyles.module.css';
import { TrueVoteSpinner } from '@/ui/TrueVoteSpinner';
import { LoadingOverlay, MantineLoaderComponent } from '@mantine/core';
import { forwardRef } from 'react';

interface TrueVoteLoaderProps {
  visible?: boolean;
}

export const TrueVoteLoader: React.FC<TrueVoteLoaderProps> = ({
  visible = true,
}): React.JSX.Element => {
  return (
    <div className={classes.loaderWrapper}>
      <LoadingOverlay visible={visible} overlayProps={{ blur: 2 }} />
    </div>
  );
};

export const TrueVoteSpinnerLoader: MantineLoaderComponent = forwardRef(() => {
  return <TrueVoteSpinner />;
});
