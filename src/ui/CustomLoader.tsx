import { TrueVoteSpinner } from '@/ui/TrueVoteSpinner';
import { LoadingOverlay, MantineLoaderComponent } from '@mantine/core';
import { forwardRef } from 'react';

interface TrueVoteLoaderProps {
  visible?: boolean;
}

export const TrueVoteLoader: React.FC<TrueVoteLoaderProps> = ({
  visible = true,
}): React.JSX.Element => {
  return <LoadingOverlay visible={visible} overlayProps={{ blur: 2 }} />;
};

export const TrueVoteSpinnerLoader: MantineLoaderComponent = forwardRef(() => {
  return <TrueVoteSpinner />;
});
