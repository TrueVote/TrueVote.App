import { SecureString, StatusModel } from '@/TrueVote.Api';
import { APIAdd, APIPing, APIStatus } from '@/services/DataClient';
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
  const [pingData, setPingData] = useState<SecureString | null>(null);
  const [addData, setAddData] = useState<SecureString | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const getColor: any = () => (colorScheme === 'dark' ? 'monokai' : 'rjv-default');
  // const { updateNostrProfile } = useGlobalContext();

  const setError: any = (errorMessage: string) => {
    setErrors((prevErrors) => [...prevErrors, errorMessage]);
  };

  useEffect(() => {
    // Call the APIStatus function
    APIStatus()
      .then((data: StatusModel) => {
        setStatusData(data);
      })
      .catch((e: SecureString) => {
        setError('A status error occurred: ' + e.Value);
        console.error('Status Error:', e);
      })
      .finally(() => {
        setLoading(false);
      });

    // Call the APIPing function
    APIPing()
      .then((data: SecureString) => {
        setPingData(data);
      })
      .catch((e: SecureString) => {
        setError('A ping error occurred: ' + e.Value);
        console.error('Ping Error:', e);
      })
      .finally(() => {
        setLoading(false);
      });

    // Call the APIPing function
    APIAdd()
      .then((data: SecureString) => {
        setAddData(data);
      })
      .catch((e: SecureString) => {
        setError('An add error occurred: ' + e.Value);
        console.error('Add Error:', e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <TrueVoteLoader />;
  }

  console.info('Status Data', statusData);
  console.info('Ping Data', pingData);
  console.info('Add Data', addData);

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Status' />
      </Stack>
      <Group mt='md' mb='xs'>
        <Stack>
          <Text size='xl'>
            API Ping Status:{' '}
            {pingData !== undefined && pingData?.Value !== undefined
              ? String(pingData?.Value)
              : '<error>'}
          </Text>
        </Stack>
      </Group>
      <Group mt='md' mb='xs'>
        <Stack>
          <Text size='xl'>
            API Add Status (Secure):{' '}
            {addData !== undefined && addData?.Value !== undefined
              ? String(addData?.Value)
              : '<error>'}
          </Text>
        </Stack>
      </Group>
      <Group mt='md' mb='xs'>
        <Stack>
          <Text size='xl'>API Status:</Text>
          {statusData !== null && statusData !== undefined ? (
            <ScrollArea className={classes.rawJson}>
              <ReactJson
                src={statusData ?? Object.create(null)}
                name='StatusData'
                collapsed={false}
                theme={getColor()}
              />
            </ScrollArea>
          ) : (
            <Text size='xl'>{String('<error>')}</Text>
          )}
        </Stack>
      </Group>
      {errors.length > 0 ? (
        errors.map((e: string, index: number) => <Text key={index}>Error: {e}</Text>)
      ) : (
        <></>
      )}
    </Container>
  );
};
