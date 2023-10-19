import { StatusModel } from '@/TrueVote.Api';
import { APIStatus } from '@/services/DataClient';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Container, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { FC, useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

export const Status: FC = () => {
  const colorScheme: 'dark' | 'light' = useColorScheme();

  const [loading, setLoading] = useState<boolean>(true);
  const [statusData, setStatusData] = useState<StatusModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const getColor: any = () => (colorScheme === 'dark' ? 'monokai' : 'rjv-default');

  useEffect(() => {
    // Call the APIStatus function
    APIStatus()
      .then((data: StatusModel) => {
        setStatusData(data);
      })
      .catch((error: any) => {
        setError('An error occurred: ' + error.status + ' : ' + error.statusText);
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <TrueVoteLoader />;
  }

  console.info(statusData);

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Status' />
        <Text size='xl'>API Status</Text>
      </Stack>
      <Group mt='md' mb='xs'>
        <ScrollArea>
          {!error ? (
            <Text size='xs'>
              <div>
                <ReactJson
                  src={statusData ?? Object.create(null)}
                  name='StatusData'
                  collapsed={false}
                  theme={getColor()}
                />
              </div>
            </Text>
          ) : (
            <></>
          )}
          {error ? <Text>{error}</Text> : <></>}
        </ScrollArea>
      </Group>
    </Container>
  );
};
