import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import classes from './sidebar-list.less';
import ListItem from './list-item.jsx';
import { TemplateData } from '../../store/index';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

class DragList extends React.Component {
  onDragStart = (result) => {
    const { templateData } = this.props;
    const { source } = result;
    this.index = source.index;
    templateData.handleDropStart(this.index)
  };

  onDragUpdate = (result) => {
    const { templateData } = this.props;
    const { destination } = result;
    if (destination == null) {
      return;
    }
    // // console.log('当前位置 : ', this.index, '目的地位置 : ',result.destination.index);
    templateData.handleDropUpScroll(this.index, destination.index, destination.index);
    this.index = destination.index;
  };

  onDragEnd = (result) => {
    const { templateData, isRefresh } = this.props;
    const { source, destination } = result;
    // 当拖动元素 越界时, 重置回上一次的位置
    if (destination == null) {
      templateData.handleDropErrOr(source.index);
      return;
    }
    // 如果相等则表示没有拖动
    if (source.index === destination.index) {
      templateData.handleDropClass('end');
      return;
    }
    isRefresh();
    templateData.handleDropScroll(source.index, destination.index);
  };

  render() {
    const { templateData, handleEdit, isRefresh } = this.props;
    const { section } = templateData;
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
      >
        <Droppable droppableId="droppable">
          {
            provideds => (
              <div
                {...provideds.droppableProps}
                ref={provideds.innerRef}
              >
                {
                  section.sectionsOrder.map((item, index) => (
                    <Draggable key={item} draggableId={item} index={index}>
                      {
                        provided => (
                          <div
                            className={classes.listItems}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ListItem
                              value={item}
                              index={index}
                              handleEdit={handleEdit}
                              isRefresh={isRefresh}
                            />
                          </div>
                        )
                      }
                    </Draggable>
                  ))
                }
                {provideds.placeholder}
              </div>
            )
          }
        </Droppable>
      </DragDropContext>
    )
  }
}

DragList.wrappedComponent.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  isRefresh: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default DragList
