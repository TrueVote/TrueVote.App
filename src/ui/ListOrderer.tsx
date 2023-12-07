import { CandidateModel } from '@/TrueVote.Api';
import classes from '@/ui/shell/AppStyles.module.css';
import { DragDropContext, Draggable, Droppable, DroppableProvided } from '@hello-pangea/dnd';
import { Avatar, Table, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { IconGripVertical } from '@tabler/icons-react';
import cx from 'clsx';
import { formatCandidateName } from './Helpers';
import listClasses from './ListOrderer.module.css';

export const ListOrderer: any = ({
  candidates,
  avatarCount,
}: {
  candidates: CandidateModel[];
  avatarCount: number;
}) => {
  const [state, handlers] = useListState(candidates);

  const items: JSX.Element[] = state.map((item: any, index: number) => (
    <Draggable key={item.CandidateId} index={index} draggableId={item.CandidateId}>
      {(provided: any, snapshot: any) => (
        <div
          className={cx(listClasses.item, { [listClasses.itemDragging]: snapshot.isDragging })}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div {...provided.dragHandleProps} className={listClasses.dragHandle}>
            <IconGripVertical size={26} />
          </div>
          <Table key={item.CandidateId} verticalSpacing='xs' className={classes.tableCandidate}>
            <Table.Tbody>
              <Table.Tr>
                {avatarCount > 0 && (
                  <Table.Td className={classes.tdCandidate} width={'30px'}>
                    <Avatar className={classes.avatarImage} src={item.CandidateImageUrl} />
                  </Table.Td>
                )}
                <Table.Td>
                  <Text className={classes.mediumText}>{formatCandidateName(item)}</Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext
      onDragEnd={({ destination, source }: { destination: any; source: any }) =>
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
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
