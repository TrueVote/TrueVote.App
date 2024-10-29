import { useGlobalContext } from '@/Global';
import { AllElections } from '@/ui/AllElections';
import { CompanyMissionBullets } from '@/ui/CompanyMissionBullets';
import classes from '@/ui/shell/AppStyles.module.css';
import { Box, Button, Container, Group, Image, Paper, Stack, Table, Text } from '@mantine/core';
import { IconLogin, IconUserPlus } from '@tabler/icons-react';
import { FC } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

export const Home: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { nostrProfile } = useGlobalContext();
  const { localization } = useGlobalContext();

  return (
    <Container size='xs' px='xs' className={classes.centerContainer}>
      <Stack gap='xs'>
        {/* Logo Section */}
        <Table
          verticalSpacing='xs'
          striped
          withTableBorder
          withColumnBorders
          className={classes.table}
        >
          <Table.Tbody>
            <Table.Tr>
              <Table.Td className={classes.tdCenter}>
                <div className={classes.wideLogoImageDiv}>
                  <Link to='/elections'>
                    <Image radius='md' className={classes.wideLogoImage} />
                  </Link>
                </div>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>

        {/* Slogan Section with more prominence */}
        <Paper p='md' radius='lg' className={classes.sloganPaper}>
          <Text size='xl' fw={700} ta='center' className={classes.homeText}>
            {localization?.getLocalizedString('SLOGAN')}
          </Text>
        </Paper>

        {/* Welcome Section */}
        {nostrProfile !== undefined && String(nostrProfile.displayName).length > 0 ? (
          <Text ta='center' size='lg'>
            {localization?.getLocalizedString('WELCOME')}, {nostrProfile.displayName}
          </Text>
        ) : (
          <Group gap='md' grow className={classes.homeButtons}>
            <Button
              leftSection={<IconUserPlus />}
              className={`${classes.primaryGreenBackgroundColor}`}
              radius='md'
              variant='filled'
              onClick={(): void => navigate('/register')}
              styles={{
                root: {
                  color: 'white',
                },
              }}
            >
              Register
            </Button>
            <Button
              leftSection={<IconLogin />}
              className={`${classes.primaryPurpleBackgroundColor}`}
              radius='md'
              variant='filled'
              onClick={(): void => navigate('/signin')}
              styles={{
                root: {
                  color: 'white',
                },
              }}
            >
              Sign In
            </Button>
          </Group>
        )}

        {/* Elections Section */}
        <Paper p='lg' radius='md' withBorder className={classes.sectionPaper}>
          <Box>
            <Text size='xl' fw={700} ta='left' mb='lg' className={classes.sectionTitle}>
              Elections
            </Text>
            <AllElections />
          </Box>
        </Paper>

        {/* Built for Future Section */}
        <Paper p='lg' radius='md' withBorder className={classes.sectionPaper}>
          <Box>
            <Text size='xl' fw={700} ta='left' mb='lg' className={classes.sectionTitle}>
              Built for the Future
            </Text>
            <CompanyMissionBullets />
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};
