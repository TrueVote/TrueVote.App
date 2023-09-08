import { CandidateModel, ElectionModel, RaceModel } from '@/TrueVote.Api';
import { RaceTypes } from '@/TrueVote.Api.ManualModels';
import { Card, Checkbox, MantineTheme, Radio, Space, Title, useMantineTheme } from '@mantine/core';
import { formatCandidateName } from './Helpers';
import { ballotViewStyles } from './shell/AppStyles';

const RaceGroup: any = ({ race, election }: { race: RaceModel; election: ElectionModel }) => {
  const theme: MantineTheme = useMantineTheme();
  const { classes, cx } = ballotViewStyles(theme);
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
          <Radio
            value={e.Name}
            label={formatCandidateName(e)}
            key={e.CandidateId}
            size='sm'
            className={cx(classes.radioBody)}
            onClick={(event: any): any => setVal(e, event.currentTarget.checked)}
          />
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
          <Checkbox
            value={e.Name}
            label={formatCandidateName(e)}
            key={e.CandidateId}
            size='sm'
            className={cx(classes.radioBody)}
            onClick={(event: any): any => setVal(e, event.currentTarget.checked)}
          />
        ))}
      </Checkbox.Group>
    );
  }
};

export const Race: any = ({ race, election }: { race: RaceModel; election: ElectionModel }) => {
  const theme: MantineTheme = useMantineTheme();
  const { classes, cx } = ballotViewStyles(theme);

  return (
    <Card className={cx(classes.cardWide)} shadow='sm' p='xs' radius='lg' withBorder>
      <RaceGroup race={race} election={election} />
    </Card>
  );
};
