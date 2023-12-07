/* eslint-disable @typescript-eslint/typedef */
import { CandidateModel } from '@/TrueVote.Api';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Text, rem } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { IconGripVertical } from '@tabler/icons-react';
import cx from 'clsx';
import { formatCandidateName } from './Helpers';
import classes from './ListOrderer.module.css';

export const ListOrderer: any = ({ candidates }: { candidates: CandidateModel[] }) => {
  const [state, handlers] = useListState(candidates);

  const items = state.map((item: any, index) => (
    <Draggable key={item.CandidateId} index={index} draggableId={item.CandidateId}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div {...provided.dragHandleProps} className={classes.dragHandle}>
            <IconGripVertical style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </div>
          <Text className={classes.symbol}>AVATAR</Text>
          <div>
            <Text>{formatCandidateName(item)}</Text>
          </div>
        </div>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
      }
    >
      <Droppable droppableId='dnd-list' direction='vertical'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
