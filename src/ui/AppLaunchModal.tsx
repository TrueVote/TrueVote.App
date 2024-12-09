import { Button, Modal, Stack, Text } from '@mantine/core';
import { JSX, useEffect, useState } from 'react';

export const AppLaunchModal: any = (): JSX.Element => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasSeenWarning = localStorage.getItem('hasSeenAppLaunchModal');
    if (!hasSeenWarning) {
      setShowModal(true);
    }
  }, []);

  const handleClose: any = () => {
    localStorage.setItem('hasSeenAppLaunchModal', 'true');
    setShowModal(false);
  };

  return (
    <Modal
      opened={showModal}
      onClose={handleClose}
      title='TrueVote Alpha Release Notice'
      size='lg'
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
    >
      <Stack gap='md'>
        <Text fw={600} c='red'>
          The TrueVote platform is currently in ALPHA stage of development.
        </Text>

        <Text>
          During this phase, you may encounter features that are still under development or require
          further refinement. We appreciate your understanding and feedback as we work to improve
          the platform.
        </Text>

        <Text fw={600} c='red'>
          Important: All elections conducted on TrueVote are &quot;mock&quot; elections. Your
          ballots are not part of any officially sanctioned election and are for testing purposes
          only.
        </Text>

        <Button fullWidth color='blue' onClick={handleClose} mt='md'>
          I Understand
        </Button>
      </Stack>
    </Modal>
  );
};
