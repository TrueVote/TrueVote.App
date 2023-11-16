import { useGlobalContext } from '@/Global';
import classes from '@/ui/shell/AppStyles.module.css';
import { Container, Image, Stack, Table, Text } from '@mantine/core';
import { FC } from 'react';

export const Home: FC = () => {
  // const theme: MantineTheme = useMantineTheme();
  // const { colorScheme } = useMantineColorScheme();
  const { nostrProfile } = useGlobalContext();
  const { localization } = useGlobalContext();

  // const getColor: any = (color: string) => theme.colors[color][colorScheme === 'dark' ? 5 : 7];

  return (
    <Container size='xs' px='xs' className={classes.centerContainer}>
      <Stack gap={32}>
        <Text className={classes.homeText}>{localization?.getLocalizedString('SLOGAN')}</Text>
      </Stack>
      {nostrProfile !== undefined && String(nostrProfile.displayName).length > 0 ? (
        <>
          <Text>
            {localization?.getLocalizedString('WELCOME')}, {nostrProfile.displayName}
          </Text>
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
            <Table.Td className={classes.tdCenter}>
              <div className={classes.voterImageDiv}>
                <Image radius='md' className={classes.voterImage}></Image>
              </div>
              <Text className={(classes.smallText, classes.tight)}>
                {localization?.getLocalizedString('VOTEONPHONEORCOMPUTER')}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className={classes.tdCenter}>
              <div className={classes.voterImageDiv}>
                <Image radius='md' className={classes.chartsImage}></Image>
              </div>
              <Text className={(classes.smallText, classes.tight)}>
                {localization?.getLocalizedString('REVIEWRESULTS')}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className={classes.tdCenter}>
              <div className={classes.homeLogoDiv}>
                <Image radius='md' className={classes.homeLogoImage}></Image>
              </div>
              <Text className={classes.smallText}></Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Container>
  );
};
