import { StatusModel } from '@/TrueVote.Api';
import { APIStatus } from '@/services/DataClient';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import {
  Container,
  Group,
  MantineTheme,
  ScrollArea,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

export const Status: FC = () => {
  const theme: MantineTheme = useMantineTheme();

  const [loading, setLoading] = useState<boolean>(true);
  const [statusData, setStatusData] = useState<StatusModel | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <Container size='xs' px='xs'>
      <Stack spacing={32}>
        <Hero title='Status' />
        <Text size='xl'>API Status</Text>
      </Stack>
      <Group position='apart' mt='md' mb='xs'>
        <ScrollArea>
          {!error ? (
            <Text size='xs'>
              <div>
                <ReactJson
                  src={statusData ?? Object.create(null)}
                  name='StatusData'
                  collapsed={false}
                  theme={theme.colorScheme === 'dark' ? 'monokai' : 'rjv-default'}
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
