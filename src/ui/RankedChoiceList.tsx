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
import { Avatar, Divider, Space, Table, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { IconGripVertical } from '@tabler/icons-react';
import cx from 'clsx';
import React, { useEffect, useState } from 'react';
import { formatCandidateName } from './Helpers';
import listClasses from './RankedChoiceList.module.css';

interface Props {
  candidates: CandidateModel[] | null;
  avatarCount: number;
  maxChoices: number;
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
  onSelectionChange,
  resetTrigger,
}: Props) => {
  const [selectedState, selectedHandlers] = useListState<CandidateModel>([]);
  const [notSelectedState, notSelectedHandlers] = useListState<CandidateModel>([]);
  const [isMaxSelected, setIsMaxSelected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const selectedDroppableClass: string = cx({
    [listClasses.selectedDroppable]: isMaxSelected,
  });

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
      onDragStart={() => {
        setIsMaxSelected(selectedState.length >= maxChoices);
      }}
      onDragEnd={({
        destination,
        source,
      }: {
        destination: DraggableLocation | null;
        source: DraggableLocation;
      }) => {
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
      <Droppable droppableId='selected' direction='vertical' isDropDisabled={isMaxSelected}>
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={selectedDroppableClass}
          >
            <Divider label={<Text>Selected</Text>} size={3} labelPosition='left' color='green' />
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
      <Droppable droppableId='notSelected' direction='vertical'>
        {(provided: DroppableProvided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Divider label={<Text>Not Selected</Text>} size={3} labelPosition='left' color='pink' />
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
    </DragDropContext>
  );
};
