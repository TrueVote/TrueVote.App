import classes from '@/ui/shell/AppStyles.module.css';
import { Box, Text } from '@mantine/core';
import { FC, JSX } from 'react';

export const NpubView: FC<{ npub: string }> = ({ npub }): JSX.Element => {
  return (
    <Box
      p='md'
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '1rem',
        width: '100%', // Ensure full width
      }}
    >
      <span
        className={classes.profileText}
        style={{
          wordBreak: 'break-all',
          maxWidth: '100%',
          fontSize: '1.1rem',
        }}
      >
        <Text fw={700} size='lg' mb={5}>
          Signed In Npub (Public) Key:
        </Text>
        <Text
          style={{
            background: 'rgba(0, 255, 0, 0.05)',
            padding: '10px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            width: '100%', // Ensure full width
          }}
        >
          {npub}
        </Text>
      </span>
    </Box>
  );
};
