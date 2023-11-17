import { CandidateModel, ElectionModel, RaceModel } from '@/TrueVote.Api';
import { RaceTypes } from '@/TrueVote.Api.ManualModels';
import classes from '@/ui/shell/AppStyles.module.css';
import { Avatar, Card, Checkbox, Radio, Space, Table, Text, Title } from '@mantine/core';
import _ from 'lodash';
import { formatCandidateName } from './Helpers';

const RaceGroup: any = ({
  race,
  election,
  avatarCount,
}: {
  race: RaceModel;
  election: ElectionModel;
  avatarCount: number;
}) => {
  const raceLabel: React.ReactNode = <Title order={4}>{race.Name}</Title>;

  const setVal: any = (cc: CandidateModel, val: string) => {
    console.info('setVal()', cc, val);

    // Find the race for this election
    const r: RaceModel | undefined = election?.Races?.find(
      (rm: RaceModel) => rm.RaceId == race.RaceId,
    );

    if (r) {
      // If this Race is a "choose one", need to loop through all the candidates and
      // unselect them in the data model.
      if (r.RaceType.toString() === RaceTypes.ChooseOne) {
        r.Candidates?.map((cm: CandidateModel) => {
          console.info('Setting choice to false for candidate: ', cm.Name);
          cm.Selected = JSON.parse('false');
        });
      }

      // Find the candidate user clicked on
      const c: CandidateModel | undefined = r.Candidates?.find(
        (cm: CandidateModel) => cm.CandidateId == cc.CandidateId,
      );

      // Finally, set the candidate selected state to user selection
      // This will likely always be 'true' for 'choose one' and 'toggle' for 'choose many'
      if (c) {
        console.info('Setting choice to ' + val + ' for candidate: ', c.Name);
        c.Selected = JSON.parse(val);
      }
    }
  };

  // TODO DRY this out
  if (race.RaceType.toString() === RaceTypes.ChooseOne) {
    return (
      <Radio.Group
        name={race.Name}
        label={raceLabel}
        size='sm'
        description={'Choose One'} // TODO Localize English
      >
        <Space h='md'></Space>
        {race.Candidates?.map((e: CandidateModel) => (
          <>
            <Table verticalSpacing='xs' className={classes.tableCandidate}>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td className={classes.tdCandidate} width={'30px'}>
                    <Radio
                      value={e.Name}
                      key={e.CandidateId}
                      size='sm'
                      onClick={(event: any): any => setVal(e, event.currentTarget.checked)}
                    />
                  </Table.Td>
                  {avatarCount > 0 && (
                    <Table.Td className={classes.tdCandidate} width={'30px'}>
                      <Avatar className={classes.avatarImage} src={e.CandidateImageUrl} />
                    </Table.Td>
                  )}
                  <Table.Td>
                    <Text className={classes.mediumText}>{formatCandidateName(e)}</Text>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </>
        ))}
      </Radio.Group>
    );
  } else {
    return (
      <Checkbox.Group
        label={raceLabel}
        size='sm'
        description={'Choose Multiple'} // TODO Localize English
      >
        <Space h='md'></Space>
        {race.Candidates?.map((e: CandidateModel) => (
          <>
            <Table verticalSpacing='xs' className={classes.tableCandidate}>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td className={classes.tdCandidate} width={'30px'}>
                    <Checkbox
                      value={e.Name}
                      key={e.CandidateId}
                      size='sm'
                      onClick={(event: any): any => setVal(e, event.currentTarget.checked)}
                    />
                  </Table.Td>
                  {avatarCount > 0 && (
                    <Table.Td className={classes.tdCandidate} width={'30px'}>
                      <Avatar className={classes.avatarImage} src={e.CandidateImageUrl} />
                    </Table.Td>
                  )}
                  <Table.Td>
                    <Text className={classes.mediumText}>{formatCandidateName(e)}</Text>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </>
        ))}
      </Checkbox.Group>
    );
  }
};

export const Race: any = ({ race, election }: { race: RaceModel; election: ElectionModel }) => {
  const candidatesWithImages: any = _.countBy(
    race.Candidates,
    (e: CandidateModel) => e.CandidateImageUrl !== '',
  );

  const avatarCount: number = candidatesWithImages.true | 0;

  return (
    <Card className={classes.cardWide} shadow='sm' p='xs' radius='lg' withBorder>
      <RaceGroup race={race} election={election} avatarCount={avatarCount} />
    </Card>
  );
};
