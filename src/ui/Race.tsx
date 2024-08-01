import { CandidateModel, ElectionModel, RaceModel } from '@/TrueVote.Api';
import { RaceTypes } from '@/TrueVote.Api.ManualModels';
import classes from '@/ui/shell/AppStyles.module.css';
import { Avatar, Card, Checkbox, Group, Radio, Space, Table, Text, Title } from '@mantine/core';
import _ from 'lodash';
import { useState } from 'react';
import { formatCandidateName } from './Helpers';
import { RankedChoiceList } from './RankedChoiceList';

const RaceGroup: any = ({
  race,
  avatarCount,
  onSelectionChange,
}: {
  race: RaceModel;
  avatarCount: number;
  onSelectionChange: () => void;
}) => {
  const raceLabel: React.ReactNode = (
    <Title key={race.RaceId} order={4}>
      {race.Name}
    </Title>
  );

  // If it's a multi-select race type, then determine how many multi-selects or ranked choice
  let maxNumberOfChoices: number = 0;
  if (race.MaxNumberOfChoices !== null && race.MaxNumberOfChoices !== undefined) {
    maxNumberOfChoices = Number(race.MaxNumberOfChoices);
  }

  // Save state for Group level handleChange() to make sure user can't select more candidates than allowed
  const [values, setValues] = useState<string[]>([]);

  const handleChange: any = (selected: string[]): any => {
    if (maxNumberOfChoices > 0) {
      setValues(selected.slice(0, maxNumberOfChoices));
      console.info('handleChange()', selected);
    }
  };

  const minChoiceDescriptionFormatted: string =
    race.MinNumberOfChoices !== null &&
    race.MinNumberOfChoices !== undefined &&
    race.MinNumberOfChoices > 0
      ? 'from ' + race.MinNumberOfChoices + ' '
      : 'up ';

  const choiceDescriptionFormatted: string =
    race.MaxNumberOfChoices !== null &&
    race.MaxNumberOfChoices !== undefined &&
    race.MaxNumberOfChoices > 0
      ? 'Choose ' + minChoiceDescriptionFormatted + 'to ' + race.MaxNumberOfChoices
      : 'Choose Multiple';

  const rankedChoiceDescriptionFormatted: string =
    race.MaxNumberOfChoices !== null &&
    race.MaxNumberOfChoices !== undefined &&
    race.MaxNumberOfChoices > 0
      ? 'Ranked Choice - Choose ' +
        minChoiceDescriptionFormatted +
        ' to ' +
        race.MaxNumberOfChoices +
        ' selections in order of preference'
      : 'Ranked Choice';

  const chooseOneDescriptionFormatted: string =
    race.MinNumberOfChoices !== null &&
    race.MinNumberOfChoices !== undefined &&
    race.MinNumberOfChoices > 0
      ? 'Must Choose 1'
      : 'Choose 1';

  const setVal: any = (cc: CandidateModel, val: string) => {
    console.debug('setVal()', cc, val, race);

    // If this Race is a "choose one", need to loop through all the candidates and
    // unselect them in the data model.
    if (race.RaceType.toString() === RaceTypes.ChooseOne) {
      console.debug('Race - Choose One');
      race.Candidates?.map((cm: CandidateModel) => {
        console.info('Setting choice to false for candidate: ', cm.Name);
        cm.Selected = JSON.parse('false');
      });
    } else if (
      race.RaceType.toString() === RaceTypes.ChooseMany &&
      race.MaxNumberOfChoices !== null &&
      race.MaxNumberOfChoices !== undefined &&
      race.MaxNumberOfChoices > 0
    ) {
      console.debug('Race - Choose Many');
      // It's choose many. See if the metadata property was set for "how many"
      // If the user is selecting > than the total number, don't let them do it
      const candidatesSelected: any = _.countBy(
        race.Candidates,
        (e: CandidateModel) => e.Selected === true,
      );

      const candidatesSelectedCount: number = candidatesSelected.true | 0;
      console.info('Candidates Selected Count ', candidatesSelectedCount);
      if (candidatesSelectedCount === Number(race.MaxNumberOfChoices)) {
        console.info('User trying to select more than ' + race.MaxNumberOfChoices + ' candidates');
        race.Candidates?.map((cm: CandidateModel) => {
          if (cc.CandidateId === cm.CandidateId) {
            console.info('Setting choice to false for candidate: ', cm.Name);
            cm.Selected = JSON.parse('false');
          }
        });
        cc.Selected = JSON.parse('false');
        cc.Selected = false;
        return;
      }
    } else if (
      race.RaceType.toString() === RaceTypes.RankedChoice &&
      race.MaxNumberOfChoices !== null &&
      race.MaxNumberOfChoices !== undefined &&
      race.MaxNumberOfChoices > 0
    ) {
      console.debug('Race - Ranked');
    }

    // Finally, set the candidate selected state to user selection
    // This will likely always be 'true' for 'choose one' and 'toggle' for 'choose many'
    console.info('Setting choice to ' + val + ' for candidate: ', cc.Name);
    cc.Selected = JSON.parse(val);

    onSelectionChange();
  };

  // TODO DRY this out
  if (race.RaceType.toString() === RaceTypes.ChooseOne) {
    return (
      <Radio.Group
        key={race.RaceId}
        name={race.Name}
        label={raceLabel}
        size='sm'
        description={chooseOneDescriptionFormatted}
      >
        <Space h='md' />
        {race.Candidates?.map((e: CandidateModel) => (
          <Table key={e.CandidateId} verticalSpacing='xs' className={classes.tableCandidate}>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className={classes.tdCandidate} width='30px'>
                  <Radio
                    value={e.Name}
                    key={e.CandidateId}
                    size='sm'
                    onClick={(event: any): any => setVal(e, event.currentTarget.checked)}
                  />
                </Table.Td>
                {avatarCount > 0 && (
                  <Table.Td className={classes.tdCandidate} width='30px'>
                    <Avatar className={classes.avatarImage} src={e.CandidateImageUrl} />
                  </Table.Td>
                )}
                <Table.Td>
                  <Text className={classes.mediumText}>{formatCandidateName(e)}</Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        ))}
      </Radio.Group>
    );
  } else if (race.RaceType.toString() === RaceTypes.ChooseMany) {
    return (
      <Checkbox.Group
        value={values}
        onChange={handleChange}
        key={race.RaceId}
        label={raceLabel}
        size='sm'
        description={choiceDescriptionFormatted}
      >
        <Space h='md' />
        {race.Candidates?.map((e: CandidateModel) => (
          <Table key={e.CandidateId} verticalSpacing='xs' className={classes.tableCandidate}>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className={classes.tdCandidate} width='30px'>
                  <Checkbox
                    value={e.Name}
                    key={e.CandidateId}
                    size='sm'
                    onClick={(event: any): any => setVal(e, event.currentTarget.checked)}
                  />
                </Table.Td>
                {avatarCount > 0 && (
                  <Table.Td className={classes.tdCandidate} width='30px'>
                    <Avatar className={classes.avatarImage} src={e.CandidateImageUrl} />
                  </Table.Td>
                )}
                <Table.Td>
                  <Text className={classes.mediumText}>{formatCandidateName(e)}</Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        ))}
      </Checkbox.Group>
    );
  } else if (race.RaceType.toString() === RaceTypes.RankedChoice) {
    if (race.Candidates) {
      return (
        <Checkbox.Group
          value={values}
          onChange={handleChange}
          key={race.RaceId}
          label={raceLabel}
          size='sm'
          description={rankedChoiceDescriptionFormatted}
        >
          <Space h='md' />
          <RankedChoiceList
            candidates={race.Candidates}
            avatarCount={avatarCount}
            maxChoices={Number(race.MaxNumberOfChoices)}
            onSelectionChange={onSelectionChange}
          />
        </Checkbox.Group>
      );
    }
  } else {
    return (
      <Group>
        <Text key={race.RaceId} size='sm'>
          {raceLabel}Unsupported Race Type
        </Text>
        <Space h='md' />
        {race.Candidates?.map((e: CandidateModel) => (
          <Table key={e.CandidateId} verticalSpacing='xs' className={classes.tableCandidate}>
            <Table.Tbody>
              <Table.Tr>
                {avatarCount > 0 && (
                  <Table.Td className={classes.tdCandidate} width='30px'>
                    <Avatar className={classes.avatarImage} src={e.CandidateImageUrl} />
                  </Table.Td>
                )}
                <Table.Td>
                  <Text className={classes.mediumText}>{formatCandidateName(e)}</Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        ))}
      </Group>
    );
  }
};

export const Race: any = ({
  race,
  election,
  onSelectionChange,
}: {
  race: RaceModel;
  election: ElectionModel;
  onSelectionChange: () => void;
}) => {
  // If the Race has no avatars amongst all the candidates, then this counter will be used above to
  // hide the avatar elements completely.
  const candidatesWithImages: any = _.countBy(
    race.Candidates,
    (e: CandidateModel) => e.CandidateImageUrl !== '',
  );

  const avatarCount: number = candidatesWithImages.true | 0;

  return (
    <Card key={race.RaceId} className={classes.cardWide} shadow='sm' p='xs' radius='lg' withBorder>
      <RaceGroup
        key={race.RaceId}
        race={race}
        election={election}
        avatarCount={avatarCount}
        onSelectionChange={onSelectionChange}
      />
    </Card>
  );
};
