import { useGlobalContext } from '@/Global';
import { StatusModel } from '@/TrueVote.Api';
import { APIStatus } from '@/services/DataClient';
import { emptyNostrProfile, nostrSignOut } from '@/services/NostrHelper';
import { TrueVoteLoader } from '@/ui/CustomLoader';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Container, Group, ScrollArea, Stack, Text, useMantineColorScheme } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

export const Status: FC = () => {
  const { colorScheme } = useMantineColorScheme();

  const [loading, setLoading] = useState<boolean>(true);
  const [statusData, setStatusData] = useState<StatusModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const getColor: any = () => (colorScheme === 'dark' ? 'monokai' : 'rjv-default');
  const { updateNostrProfile } = useGlobalContext();

  const signOutFunction: any = () => {
    console.info('~signOutFunction');
    updateNostrProfile(emptyNostrProfile);
    nostrSignOut();
  };

  useEffect(() => {
    // Call the APIStatus function
    APIStatus(signOutFunction)
      .then((data: StatusModel) => {
        setStatusData(data);
      })
      .catch((e: any) => {
        setError('An error occurred: ' + e.status + ' : ' + e.statusText);
        console.error('Error:', e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <TrueVoteLoader />;
  }

  console.info('Status Data', statusData);

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Status' />
        <Text size='xl'>API Status</Text>
      </Stack>
      <Group mt='md' mb='xs'>
        <ScrollArea className={classes.rawJson}>
          {!error ? (
            <ReactJson
              src={statusData ?? Object.create(null)}
              name='StatusData'
              collapsed={false}
              theme={getColor()}
            />
          ) : (
            <></>
          )}
          {error ? <Text>{error}</Text> : <></>}
        </ScrollArea>
      </Group>
    </Container>
  );
};
