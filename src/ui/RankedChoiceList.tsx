import { CandidateModel } from '@/TrueVote.Api';
import classes from '@/ui/shell/AppStyles.module.css';
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
} from '@hello-pangea/dnd';
import { Avatar, Box, Divider, Group, Space, Table, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { IconArrowUp, IconGripVertical } from '@tabler/icons-react';
import cx from 'clsx';
import React, { useEffect, useState } from 'react';
import { formatCandidateName } from './Helpers';
import listClasses from './RankedChoiceList.module.css';

interface Props {
  candidates: CandidateModel[] | null;
  avatarCount: number;
  maxChoices: number;
  minChoices: number;
  onSelectionChange: () => void;
  resetTrigger: number;
}

const RenderCandidate: React.FC<{
  candidate: CandidateModel;
  avatarCount: number;
  index: number;
  provided: DraggableProvided;
  showNumbers: boolean;
}> = (props: {
  candidate: CandidateModel;
  avatarCount: number;
  index: number;
  provided: DraggableProvided;
  showNumbers: boolean;
}) => {
  const { candidate, avatarCount, index, provided, showNumbers } = props;
  return (
    <>
      <div {...provided.dragHandleProps} className={listClasses.dragHandle}>
        <IconGripVertical size={26} />
      </div>
      <Table key={candidate.CandidateId} verticalSpacing='xs' className={classes.tableCandidate}>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td className={classes.tdCandidate} width='30px'>
              {showNumbers && <Text className={listClasses.rank}>{index + 1}</Text>}
            </Table.Td>
            {avatarCount > 0 && (
              <Table.Td className={classes.tdCandidate} width='30px'>
                <Avatar className={classes.avatarImage} src={candidate.CandidateImageUrl} />
              </Table.Td>
            )}
            <Table.Td>
              <Text className={classes.mediumText}>{formatCandidateName(candidate)}</Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </>
  );
};

export const RankedChoiceList: React.FC<Props> = ({
  candidates,
  avatarCount,
  maxChoices,
  minChoices,
  onSelectionChange,
  resetTrigger,
}: Props) => {
  const [selectedState, selectedHandlers] = useListState<CandidateModel>([]);
  const [notSelectedState, notSelectedHandlers] = useListState<CandidateModel>([]);
  const [isMaxSelected, setIsMaxSelected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragSource, setDragSource] = useState<string | null>(null);

  const reSelect = (): void => {
    selectedState.forEach((c: CandidateModel, index: number) => {
      c.Selected = true;
      c.SelectedMetadata = index.toString();
    });

    notSelectedState.forEach((c: CandidateModel) => {
      c.Selected = false;
      c.SelectedMetadata = '';
    });
  };

  useEffect(() => {
    if (!isInitialized) {
      const initialSelected = candidates?.filter((c) => c.Selected) ?? [];
      const initialNotSelected = candidates?.filter((c) => !c.Selected) ?? [];
      selectedHandlers.setState(initialSelected);
      notSelectedHandlers.setState(initialNotSelected);
      setIsInitialized(true);
    }
  }, [candidates, isInitialized]);

  useEffect(() => {
    if (resetTrigger > 0) {
      selectedHandlers.setState([]);
      notSelectedHandlers.setState(candidates ?? []);
      reSelect();
      onSelectionChange();
    }
  }, [resetTrigger]);

  useEffect(() => {
    reSelect();
    onSelectionChange();
  }, [selectedState, notSelectedState]);

  return (
    <DragDropContext
      onDragStart={(start) => {
        setIsDragging(true);
        setDragSource(start.source.droppableId);
        setIsMaxSelected(selectedState.length >= maxChoices);
      }}
      onDragEnd={({
        destination,
        source,
      }: {
        destination: DraggableLocation | null;
        source: DraggableLocation;
      }) => {
        setIsDragging(false);
        setDragSource(null);
        setIsMaxSelected(false);

        if (!destination) return;

        const movedCandidate: CandidateModel =
          source.droppableId === 'selected'
            ? selectedState[source.index]
            : notSelectedState[source.index];

        if (source.droppableId === 'selected' && destination.droppableId === 'selected') {
          // Move within 'Selected'
          selectedHandlers.reorder({ from: source.index, to: destination.index });
        } else if (source.droppableId === 'notSelected' && destination.droppableId === 'selected') {
          // Move from 'Not Selected' to 'Selected'
          if (selectedState.length < maxChoices) {
            notSelectedHandlers.setState((prev: CandidateModel[]) => {
              const newState: CandidateModel[] = [...prev];
              newState.splice(source.index, 1);
              return newState;
            });

            selectedHandlers.setState((prev: CandidateModel[]) => {
              const newState: CandidateModel[] = [...prev];
              newState.splice(destination.index, 0, movedCandidate);
              return newState;
            });
          }
        } else if (source.droppableId === 'selected' && destination.droppableId === 'notSelected') {
          // Move from 'Selected' to 'Not Selected'
          selectedHandlers.setState((prev: CandidateModel[]) => {
            const newState: CandidateModel[] = [...prev];
            newState.splice(source.index, 1);
            return newState;
          });

          notSelectedHandlers.setState((prev: CandidateModel[]) => {
            const newState: CandidateModel[] = [...prev];
            newState.splice(destination.index, 0, movedCandidate);
            return newState;
          });
        }
      }}
    >
      <Box>
        <Droppable droppableId='selected' direction='vertical' isDropDisabled={isMaxSelected}>
          {(provided: DroppableProvided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cx(listClasses.dropZone, {
                [listClasses.dropZoneActive]:
                  isDragging && dragSource === 'notSelected' && !isMaxSelected,
                [listClasses.selectedDroppable]: isMaxSelected,
              })}
            >
              <Group justify='space-between' align='center'>
                <Divider
                  label={
                    <Group gap='xs'>
                      <Text>
                        Selected ({selectedState.length}/{maxChoices})
                      </Text>
                      {isDragging && dragSource === 'notSelected' && !isMaxSelected && (
                        <Text size='sm' color='dimmed'>
                          Drop here to select
                        </Text>
                      )}
                      {selectedState.length < minChoices && (
                        <Text size='sm' c='yellow'>
                          {minChoices - selectedState.length} more{' '}
                          {minChoices - selectedState.length === 1 ? 'selection' : 'selections'}{' '}
                          required
                        </Text>
                      )}
                      {isMaxSelected && (
                        <Text size='sm' color='red'>
                          Maximum {maxChoices} {maxChoices === 1 ? 'selection' : 'selections'}
                        </Text>
                      )}
                    </Group>
                  }
                  size={3}
                  labelPosition='left'
                  color='green'
                  style={{ flexGrow: 1 }}
                />
              </Group>{' '}
              <Space h='md' />
              {selectedState.map((candidate: CandidateModel, index: number) => (
                <Draggable
                  key={candidate.CandidateId}
                  index={index}
                  draggableId={candidate.CandidateId ? candidate.CandidateId : ''}
                >
                  {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                    <div
                      className={cx(listClasses.item, {
                        [listClasses.itemDragging]: snapshot.isDragging,
                      })}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <RenderCandidate
                        candidate={candidate}
                        avatarCount={avatarCount}
                        index={index}
                        provided={provided}
                        showNumbers={true}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Box>

      <Space h='md' />

      <Box style={{ opacity: isDragging && dragSource === 'notSelected' ? 0.5 : 1 }}>
        <Droppable droppableId='notSelected' direction='vertical'>
          {(provided: DroppableProvided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Group justify='space-between' align='center'>
                <Divider
                  label={
                    <Group gap='xs'>
                      <Text>Not Selected</Text>
                      <Text size='sm' c='pink'>
                        Grab handle on left and drag up to Selected
                      </Text>
                      {isDragging && dragSource === 'notSelected' && (
                        <Group gap='xs' style={{ color: 'var(--mantine-color-blue-5)' }}>
                          <Box
                            style={{
                              '@keyframes bounce': {
                                '0%, 100%': { transform: 'translateY(0)' },
                                '50%': { transform: 'translateY(-20%)' },
                              },
                              animation: 'bounce 1s infinite',
                            }}
                          >
                            <IconArrowUp size={16} />
                          </Box>
                          <Text size='sm'>Drag up to select</Text>
                        </Group>
                      )}
                    </Group>
                  }
                  size={3}
                  labelPosition='left'
                  color='pink'
                  style={{ flexGrow: 1 }}
                />
              </Group>
              <Space h='md' />
              {notSelectedState.map((candidate: CandidateModel, index: number) => (
                <Draggable
                  key={candidate.CandidateId}
                  index={index}
                  draggableId={candidate.CandidateId ? candidate.CandidateId : ''}
                >
                  {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                    <div
                      className={cx(listClasses.item, {
                        [listClasses.itemDragging]: snapshot.isDragging,
                      })}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <RenderCandidate
                        candidate={candidate}
                        avatarCount={avatarCount}
                        index={index}
                        provided={provided}
                        showNumbers={false}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Box>
    </DragDropContext>
  );
};
