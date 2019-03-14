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

class List extends React.Component {
  onDragStart = (result) => {
    const { templateData } = this.props;
    this.index = result.source.index;
    templateData.handleDropStart('start', this.index)
  };

  onDragUpdate = (result) => {
    if (!result.destination) {
      return;
    }
    const { templateData } = this.props;
    // // console.log('当前位置 : ', this.index, '目的地位置 : ',result.destination.index);
    templateData.handleDropUpScroll(this.index, result.destination.index, result.destination.index);
    this.index = result.destination.index;
  };

  onDragEnd = (result) => {
    const { templateData } = this.props;
    // 当拖动元素 越界时, 重置回上一次的位置
    if (!result.destination) {
      templateData.handleDropErrOr(result.source.index);
      return;
    }

    templateData.handleDropScroll(result.source.index, result.destination.index);
  };

  render() {
    const { templateData, handleEdit, isRefresh } = this.props;
    const { section } = templateData;
    console.log(' ---------》》》》》》 刷新了');
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
                              // title={section[item].config.title}
                              // isHidden={section[item].isHidden}
                              // handleDelete={this.handleDelete}
                              // handleIsHidden={this.handleIsHidden}
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

List.wrappedComponent.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  isRefresh: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default List
