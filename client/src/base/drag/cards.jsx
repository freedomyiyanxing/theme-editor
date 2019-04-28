/* eslint-disable */
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { DragSource, DropTarget } from 'react-dnd';

const Card = forwardRef(
  ({ children, isDragging, connectDragSource, connectDropTarget }, ref) => {
    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDropTarget(elementRef);
    const opacity = isDragging ? 0 : 1;
    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
    }));
    return (
      <div ref={elementRef} style={{ opacity }}>
        {children}
      </div>
    );
  },
);

export default DropTarget(
  'card',
  {
    hover(props, monitor, component) {
      if (!component) {
        return null;
      }
      const node = component.getNode();
      if (!node) {
        return null;
      }
      const dragIndex = monitor.getItem().index;
      const hoverIndex = props.index;
      if (dragIndex === hoverIndex) {
        return false;
      }
      const hoverBoundingRect = node.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return false;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return false;
      }
      props.myMove && props.myMove(dragIndex, hoverIndex, hoverBoundingRect.y);
      monitor.getItem().index = hoverIndex;
      return false;
    },
  },
  connect => ({
    connectDropTarget: connect.dropTarget(),
  }),
)(
  DragSource(
    'card',
    {
      beginDrag: (props) => {
        props.myBeginDrag && props.myBeginDrag(props.index);
        return {
          id: props.id,
          index: props.index,
        };
      },
      endDrag: (props, monitor) => {
        props.myEndDrag && props.myEndDrag(props.index, monitor.getItem().index);
      },
      canDrag: (props) => {
        return !props.isHidden;
      },
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(Card),
);
