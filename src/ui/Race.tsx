import { CandidateModel, ElectionModel, RaceModel } from '@/TrueVote.Api';
import { RaceTypes } from '@/TrueVote.Api.ManualModels';
import classes from '@/ui/shell/AppStyles.module.css';
import { Avatar, Card, Checkbox, Group, Radio, Space, Table, Text, Title } from '@mantine/core';
import _ from 'lodash';
import { useState } from 'react';
import { formatCandidateName } from './Helpers';
import { RankedChoiceList } from './RankedChoiceList';

const RaceGroup: any = ({ race, avatarCount }: { race: RaceModel; avatarCount: number }) => {
  const raceLabel: React.ReactNode = (
    <Title key={race.RaceId} order={4}>
      {race.Name}
    </Title>
  );

  // If it's a multi-select race type, then determine how many multi-selects or ranked choice
  let raceTypeMetadata: number = 0;
  if (race.RaceTypeMetadata !== null && race.RaceTypeMetadata !== '') {
    raceTypeMetadata = Number(race.RaceTypeMetadata);
  }

  // Save state for Group level handleChange() to make sure user can't select more candidates than allowed
  const [values, setValues] = useState<string[]>([]);

  const handleChange: any = (selected: string[]): any => {
    if (raceTypeMetadata > 0) {
      setValues(selected.slice(0, raceTypeMetadata));
      console.info('handleChange()', selected);
    }
  };

  const setVal: any = (cc: CandidateModel, val: string) => {
    console.info('setVal()', cc, val);

    // If this Race is a "choose one", need to loop through all the candidates and
    // unselect them in the data model.
    if (race.RaceType.toString() === RaceTypes.ChooseOne) {
      race.Candidates?.map((cm: CandidateModel) => {
        console.info('Setting choice to false for candidate: ', cm.Name);
        cm.Selected = JSON.parse('false');
      });
    } else if (
      race.RaceType.toString() === RaceTypes.ChooseMany &&
      race.RaceTypeMetadata !== null &&
      race.RaceTypeMetadata !== ''
    ) {
      // It's choose many. See if the metadata property was set for "how many"
      // If the user is selecting > than the total number, don't let them do it
      const candidatesSelected: any = _.countBy(
        race.Candidates,
        (e: CandidateModel) => e.Selected === true,
      );

      const candidatesSelectedCount: number = candidatesSelected.true | 0;
      console.info('Candidates Selected Count ', candidatesSelectedCount);
      if (candidatesSelectedCount === Number(race.RaceTypeMetadata)) {
        console.info('User trying to select more than ' + race.RaceTypeMetadata + ' candidates');
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
      race.RaceTypeMetadata !== null &&
      race.RaceTypeMetadata !== ''
    ) {
      console.info('Ranked');
    }

    // Finally, set the candidate selected state to user selection
    // This will likely always be 'true' for 'choose one' and 'toggle' for 'choose many'
    console.info('Setting choice to ' + val + ' for candidate: ', cc.Name);
    cc.Selected = JSON.parse(val);
  };

  // TODO DRY this out
  if (race.RaceType.toString() === RaceTypes.ChooseOne) {
    return (
      <Radio.Group
        key={race.RaceId}
        name={race.Name}
        label={raceLabel}
        size='sm'
        description={'Choose One'} // TODO Localize English
      >
        <Space h='md'></Space>
        {race.Candidates?.map((e: CandidateModel) => (
          <Table key={e.CandidateId} verticalSpacing='xs' className={classes.tableCandidate}>
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
        description={
          race.RaceTypeMetadata !== null && race.RaceTypeMetadata !== ''
            ? 'Choose up to ' + race.RaceTypeMetadata
            : 'Choose Multiple'
        } // TODO Localize English
      >
        <Space h='md'></Space>
        {race.Candidates?.map((e: CandidateModel) => (
          <Table key={e.CandidateId} verticalSpacing='xs' className={classes.tableCandidate}>
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
        ))}
      </Checkbox.Group>
    );
  } else if (race.RaceType.toString() === RaceTypes.RankedChoice) {
    return (
      <Checkbox.Group
        value={values}
        onChange={handleChange}
        key={race.RaceId}
        label={raceLabel}
        size='sm'
        description={
          race.RaceTypeMetadata !== null && race.RaceTypeMetadata !== ''
            ? 'Ranked Choice - up to ' +
              race.RaceTypeMetadata +
              ' selections in order of preference'
            : 'Ranked Choice'
        } // TODO Localize English
      >
        <Space h='md'></Space>
        <RankedChoiceList
          candidates={race.Candidates}
          avatarCount={avatarCount}
          maxChoices={Number(race.RaceTypeMetadata)}
        ></RankedChoiceList>
      </Checkbox.Group>
    );
  } else {
    return (
      <Group>
        <Text key={race.RaceId} size='sm'>
          {raceLabel}Unsupported Race Type
        </Text>
        <Space h='md'></Space>
        {race.Candidates?.map((e: CandidateModel) => (
          <Table key={e.CandidateId} verticalSpacing='xs' className={classes.tableCandidate}>
            <Table.Tbody>
              <Table.Tr>
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
        ))}
      </Group>
    );
  }
};

export const Race: any = ({ race, election }: { race: RaceModel; election: ElectionModel }) => {
  // If the Race has no avatars amongst all the candidates, then this counter will be used above to
  // hide the avatar elements completely.
  const candidatesWithImages: any = _.countBy(
    race.Candidates,
    (e: CandidateModel) => e.CandidateImageUrl !== '',
  );

  const avatarCount: number = candidatesWithImages.true | 0;

  return (
    <Card key={race.RaceId} className={classes.cardWide} shadow='sm' p='xs' radius='lg' withBorder>
      <RaceGroup key={race.RaceId} race={race} election={election} avatarCount={avatarCount} />
    </Card>
  );
};
