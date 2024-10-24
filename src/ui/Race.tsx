import { CandidateModel, RaceModel } from '@/TrueVote.Api';
import { RaceTypes } from '@/TrueVote.Api.ManualModels';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  ActionIcon,
  Avatar,
  Card,
  Checkbox,
  Group,
  Radio,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { IconEraser } from '@tabler/icons-react';
import _ from 'lodash';
import { useState } from 'react';
import { formatCandidateName } from './Helpers';
import { RankedChoiceList } from './RankedChoiceList';

const RaceGroup: React.FC<{
  race: RaceModel;
  avatarCount: number;
  onSelectionChange: () => void;
}> = ({
  race,
  avatarCount,
  onSelectionChange,
}: {
  race: RaceModel;
  avatarCount: number;
  onSelectionChange: () => void;
}): JSX.Element => {
  const [values, setValues] = useState<string[]>([]);
  const [resetTrigger, setResetTrigger] = useState(0);

  const maxNumberOfChoices = Number(race.MaxNumberOfChoices) || 0;

  const handleClear = (): void => {
    console.debug('handleClear()', race.Name);
    setValues([]);
    race.Candidates?.forEach((candidate: CandidateModel) => {
      candidate.Selected = false;
      candidate.SelectedMetadata = '';
    });
    if (race.RaceType.toString() === RaceTypes.RankedChoice) {
      setResetTrigger((prev) => prev + 1);
    }
    onSelectionChange();
  };

  const handleChange = (selected: string[]): void => {
    if (maxNumberOfChoices > 0) {
      setValues(selected.slice(0, maxNumberOfChoices));
    }
    onSelectionChange();
  };

  const setVal = (candidate: CandidateModel, isChecked: boolean): void => {
    if (race.RaceType.toString() === RaceTypes.ChooseOne) {
      race.Candidates?.forEach((c: CandidateModel) => (c.Selected = false));
    } else if (race.RaceType.toString() === RaceTypes.ChooseMany && maxNumberOfChoices > 0) {
      const selectedCount = race.Candidates?.filter((c: CandidateModel) => c.Selected).length || 0;
      if (selectedCount >= maxNumberOfChoices && isChecked) {
        console.info('User trying to select more than allowed candidates');
        return;
      }
    }

    candidate.Selected = isChecked;
    onSelectionChange();
  };

  const getDescription = (): string => {
    const minChoice =
      race.MinNumberOfChoices && race.MinNumberOfChoices > 0
        ? `from ${race.MinNumberOfChoices} `
        : 'up ';
    const maxChoice = maxNumberOfChoices > 0 ? `to ${maxNumberOfChoices}` : '';

    switch (race.RaceType.toString()) {
      case RaceTypes.ChooseOne:
        return race.MinNumberOfChoices && race.MinNumberOfChoices > 0
          ? 'Must Choose 1'
          : 'Choose 1';
      case RaceTypes.ChooseMany:
        return `Choose ${minChoice}${maxChoice}`;
      case RaceTypes.RankedChoice:
        return `Ranked Choice - Choose ${minChoice}${maxChoice} selections in order of preference`;
      default:
        return '';
    }
  };

  const renderCandidateRow = (candidate: CandidateModel): JSX.Element => (
    <Table key={candidate.CandidateId} verticalSpacing='xs' className={classes.tableCandidate}>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td className={classes.tdCandidate} width='30px'>
            {race.RaceType.toString() === RaceTypes.ChooseOne ? (
              <Radio
                value={candidate.Name}
                key={candidate.CandidateId}
                size='sm'
                onChange={(event) => setVal(candidate, event.currentTarget.checked)}
              />
            ) : (
              <Checkbox
                value={candidate.Name}
                key={candidate.CandidateId}
                size='sm'
                onChange={(event) => setVal(candidate, event.currentTarget.checked)}
              />
            )}
          </Table.Td>
          {avatarCount > 0 && (
            <Table.Td className={classes.tdCandidate} width='30px'>
              <Avatar size='lg' className={classes.avatarImage} src={candidate.CandidateImageUrl} />
            </Table.Td>
          )}
          <Table.Td>
            <Text className={classes.mediumText}>{formatCandidateName(candidate)}</Text>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );

  const renderRace = (): JSX.Element => {
    switch (race.RaceType.toString()) {
      case RaceTypes.ChooseOne:
        return (
          <Radio.Group
            name={race.Name}
            value={values[0] || ''}
            onChange={(value) => handleChange([value])}
          >
            {race.Candidates?.map(renderCandidateRow)}
          </Radio.Group>
        );
      case RaceTypes.ChooseMany:
        return (
          <Checkbox.Group value={values} onChange={handleChange}>
            {race.Candidates?.map(renderCandidateRow)}
          </Checkbox.Group>
        );
      case RaceTypes.RankedChoice:
        return (
          <RankedChoiceList
            resetTrigger={resetTrigger}
            candidates={race.Candidates || []}
            avatarCount={avatarCount}
            maxChoices={maxNumberOfChoices}
            onSelectionChange={onSelectionChange}
          />
        );
      default:
        return <Text>Unsupported Race Type</Text>;
    }
  };

  return (
    <div key={race.RaceId}>
      <Title order={4}>{race.Name}</Title>
      <Text size='sm' mb='xs'>
        {getDescription()}
      </Text>
      {renderRace()}
      <Group mt='xs'>
        <ActionIcon size='xs' color='gray' onClick={handleClear}>
          <IconEraser size={14} />
        </ActionIcon>
      </Group>
    </div>
  );
};

export const Race = ({
  race,
  onSelectionChange,
}: {
  race: RaceModel;
  onSelectionChange: () => void;
}): JSX.Element => {
  const avatarCount = _.countBy(race.Candidates, (e) => e.CandidateImageUrl !== '').true || 0;

  return (
    <Card key={race.RaceId} className={classes.cardWide} shadow='sm' p='xs' radius='lg' withBorder>
      <RaceGroup
        key={race.RaceId}
        race={race}
        avatarCount={avatarCount}
        onSelectionChange={onSelectionChange}
      />
    </Card>
  );
};
