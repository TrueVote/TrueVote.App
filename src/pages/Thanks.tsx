import { SubmitBallotModelResponse } from '@/TrueVote.Api';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Container, Image, Stack, Table, Text } from '@mantine/core';
import { FC } from 'react';
import { useLocation } from 'react-router-dom';

export const Thanks: FC = () => {
  const location: any = useLocation();
  const submitBallotModelResponse: SubmitBallotModelResponse = location.state;

  console.info('Thanks Data', submitBallotModelResponse);

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Thanks!' />
        <Text size='xl'>Thank you for submitting your ballot.</Text>
        <Table
          verticalSpacing='xs'
          striped
          withTableBorder
          withColumnBorders
          className={classes.table}
        >
          <Table.Tbody>
            <Table.Tr>
              <Table.Td className={classes.tdRight}>Election Id:</Table.Td>
              <Table.Td className={classes.tdLeft}>{submitBallotModelResponse.ElectionId}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className={classes.tdRight}>Ballot Id:</Table.Td>
              <Table.Td className={classes.tdLeft}>{submitBallotModelResponse.BallotId}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        <Text>You will receive a notification once your ballot has been validated!</Text>
        <Table
          verticalSpacing='xs'
          striped
          withTableBorder
          withColumnBorders
          className={classes.table}
        >
          <Table.Tbody>
            <Table.Tr>
              <Table.Td colSpan={2} className={classes.tdCenter}>
                <div className={classes.homeLogoDiv}>
                  <Image radius='md' className={classes.thanksLogoImage}></Image>
                </div>
                <Text className={classes.smallText}></Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Stack>
    </Container>
  );
};
