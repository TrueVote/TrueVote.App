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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      <LoadingOverlay
        visible={visible}
        overlayProps={{ blur: 2 }}
        loaderProps={{ children: <TrueVoteSpinner /> }}
      />
    </div>
  );
};

export const TrueVoteSpinnerLoader: MantineLoaderComponent = forwardRef(() => {
  return <TrueVoteSpinner />;
});
