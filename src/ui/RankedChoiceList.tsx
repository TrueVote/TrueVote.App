import { CandidateModel } from '@/TrueVote.Api';
import classes from '@/ui/shell/AppStyles.module.css';
import { DragDropContext, Draggable, Droppable, DroppableProvided } from '@hello-pangea/dnd';
import { Avatar, Divider, Space, Table, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { IconGripVertical } from '@tabler/icons-react';
import cx from 'clsx';
import { formatCandidateName } from './Helpers';
import listClasses from './RankedChoiceList.module.css';

interface Props {
  candidates: CandidateModel[] | null;
  avatarCount: number;
  numChoices: number;
}

const RenderCandidate: any = ({
  candidate,
  avatarCount,
  numChoices,
  index,
  provided,
}: {
  candidate: CandidateModel;
  avatarCount: number;
  numChoices: number;
  index: number;
  provided: any;
}) => {
  return (
    <>
      <div {...provided.dragHandleProps} className={listClasses.dragHandle}>
        <IconGripVertical size={26} />
      </div>
      <Table key={candidate.CandidateId} verticalSpacing='xs' className={classes.tableCandidate}>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td className={classes.tdCandidate} width={'30px'}>
              {index < numChoices ? <Text className={listClasses.rank}>{index + 1}</Text> : ''}
            </Table.Td>
            {avatarCount > 0 && (
              <Table.Td className={classes.tdCandidate} width={'30px'}>
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
  numChoices,
}: Props) => {
  const [state, handlers] = useListState<CandidateModel>(candidates ? candidates : undefined);

  const items: JSX.Element[] = state.map((item: CandidateModel, index: number) => (
    <>
      {index == 0 && (
        <>
          <Divider label={<Text>Selected</Text>} size={3} labelPosition='left' color='green' />
          <Space h='md'></Space>
        </>
      )}
      <Draggable
        key={item.CandidateId}
        index={index}
        draggableId={item.CandidateId ? item.CandidateId : ''}
      >
        {(provided: any, snapshot: any) => (
          <div
            className={cx(listClasses.item, { [listClasses.itemDragging]: snapshot.isDragging })}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <RenderCandidate
              candidate={item}
              avatarCount={avatarCount}
              numChoices={numChoices}
              index={index}
              provided={provided}
            />
          </div>
        )}
      </Draggable>
      {index + 1 == numChoices && (
        <>
          <Divider label={<Text>Not Selected</Text>} size={3} labelPosition='left' color='pink' />
          <Space h='md'></Space>
        </>
      )}
    </>
  ));

  return (
    <DragDropContext
      onDragEnd={({ destination, source }: { destination: any; source: any }) =>
        handlers.reorder({ from: source.index, to: destination?.index ?? 0 })
      }
    >
      <Droppable droppableId='dnd-list' direction='vertical'>
        {(provided: DroppableProvided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
