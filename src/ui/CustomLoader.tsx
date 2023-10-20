/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/typedef */
import { LoadingOverlay, MantineLoaderComponent } from '@mantine/core';
import { TrueVoteSpinner } from '@/ui/TrueVoteSpinner';
import { forwardRef } from 'react';

interface TrueVoteLoaderProps {
  visible?: boolean;
}

export const TrueVoteLoader: React.FC<TrueVoteLoaderProps> = ({
  visible = true,
}): React.JSX.Element => {
  return <LoadingOverlay visible={visible} overlayProps={{ blur: 2 }}></LoadingOverlay>;
};

TrueVoteLoader.defaultProps = {
  visible: true,
};

export const TrueVoteSpinnerLoader: MantineLoaderComponent = forwardRef(() => {
  return <TrueVoteSpinner />;
});
