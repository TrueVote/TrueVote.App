import { Button, Group, Modal, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { ReactElement } from 'react';
import styles from './ErrorModal.module.css';

interface ErrorModalProps {
  visible: boolean;
  title: string;
  text: string;
  onClose: () => void;
}

export const ErrorModal = ({ visible, title, text, onClose }: ErrorModalProps): ReactElement => {
  return (
    <Modal
      opened={visible}
      onClose={onClose}
      centered
      padding='xl'
      className={styles.modal}
      withCloseButton={false}
      size='md'
    >
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <IconAlertCircle size={40} className={styles.icon} />
        </div>

        <Text className={styles.title} size='lg' fw={600}>
          {title}
        </Text>

        <Text className={styles.message} size='sm'>
          {text}
        </Text>

        <Group align='center' mt='xs'>
          <Button variant='filled' className={styles.button} onClick={onClose}>
            CLOSE
          </Button>
        </Group>
      </div>
    </Modal>
  );
};
