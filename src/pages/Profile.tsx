import { useGlobalContext } from '@/Global';
import { Hero } from '@/ui/Hero';
import { Settings } from '@/ui/Settings';
import classes from '@/ui/shell/AppStyles.module.css';
import { Button, Container, Image, Space, Stack, Table } from '@mantine/core';
import { FC } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export const Profile: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { nostrProfile } = useGlobalContext();

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Profile' />
      </Stack>
      {nostrProfile !== undefined && String(nostrProfile.displayName).length > 0 ? (
        <>
          {nostrProfile?.picture !== undefined && String(nostrProfile.picture).length > 0 ? (
            <>
              <div className={classes.profileImageDiv}>
                <Image
                  alt='Avatar'
                  radius='xl'
                  src={nostrProfile?.picture}
                  className={classes.profileImage}
                />
              </div>
            </>
          ) : (
            <></>
          )}
          <Table
            verticalSpacing='xs'
            striped
            withTableBorder
            withColumnBorders
            className={classes.table}
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className={classes.tdRight}>Name:</Table.Td>
                <Table.Td className={classes.profileName}>{nostrProfile.displayName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={classes.tdRight}>About:</Table.Td>
                <Table.Td className={classes.profileText}>{nostrProfile.about}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={classes.tdRight}>Nip05:</Table.Td>
                <Table.Td className={classes.profileText}>{nostrProfile.nip05}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Space h='md'></Space>
          <Settings nostrProfile={nostrProfile} />
          <Space h='md'></Space>
          <Button
            radius='md'
            color='blue'
            variant='light'
            onClick={(): void => navigate('/signout')}
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Stack className={classes.profileButtons}>
            <Button
              radius='md'
              color='blue'
              variant='light'
              onClick={(): void => navigate('/signin')}
            >
              Sign In
            </Button>
            <Button
              radius='md'
              color='blue'
              variant='light'
              onClick={(): void => navigate('/register')}
            >
              Register
            </Button>
          </Stack>
        </>
      )}
    </Container>
  );
};
