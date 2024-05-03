import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import versionJson from '@/version.json';
import { Container, Group, ScrollArea, Stack, Text, useMantineColorScheme } from '@mantine/core';
import { FC } from 'react';
import ReactJson from 'react-json-view';

export const Version: FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const getColor: any = () => (colorScheme === 'dark' ? 'monokai' : 'rjv-default');

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Version' />
      </Stack>
      <Group mt='md' mb='xs'>
        <Stack>
          <Text size='xl'>Version Info:</Text>
          <ScrollArea className={classes.rawJson}>
            <ReactJson src={versionJson} name='VersionData' collapsed={false} theme={getColor()} />
          </ScrollArea>
        </Stack>
      </Group>
    </Container>
  );
};
