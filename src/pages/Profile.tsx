import { useGlobalContext } from '@/Global';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Container, Image, Space, Stack, Table } from '@mantine/core';
import { FC } from 'react';
import { Link } from 'react-router-dom';

export const Profile: FC = () => {
  const { nostrProfile } = useGlobalContext();

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Profile' />
      </Stack>
      {nostrProfile !== undefined && String(nostrProfile.name).length > 0 ? (
        <>
          <div className={classes.profileImageDiv}>
            <Image
              alt='Avatar'
              radius='xl'
              src={nostrProfile?.avatar}
              className={classes.profileImage}
            />
          </div>
          <Table
            verticalSpacing='xs'
            striped
            withTableBorder
            withColumnBorders
            className={classes.table}
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className={classes.tdLeft}>Name:</Table.Td>
                <Table.Td className={classes.profileName}>{nostrProfile.name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={classes.tdLeft}>Public Key:</Table.Td>
                <Table.Td className={classes.textChopped}>{nostrProfile.npub}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={classes.tdLeft}>About:</Table.Td>
                <Table.Td className={classes.profileText}>{nostrProfile.about}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={classes.tdLeft}>Nip05:</Table.Td>
                <Table.Td className={classes.profileText}>{nostrProfile.nip05}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Space h='md'></Space>
          <Link className={classes.pagelinkActive} to='/signout'>
            Sign Out
          </Link>
        </>
      ) : (
        <>
          <Stack>
            <Link className={classes.pagelinkActive} to='/signin'>
              Sign In
            </Link>
            <Link className={classes.pagelinkActive} to='/register'>
              Register
            </Link>
          </Stack>
        </>
      )}
    </Container>
  );
};
