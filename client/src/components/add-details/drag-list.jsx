import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { TemplateData } from '../../store/index';
import DetailsListItem from './details-list.jsx';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

class DragList extends React.Component {
  onDragEnd = (result) => {
    const { templateData, name, refresh } = this.props;
    const { source, destination } = result;
    // 排除异常情况
    if (destination == null) {
      return;
    }
    // 如果相等 表示没有拖动
    if (source.index === destination.index) {
      return;
    }
    refresh();
    templateData.componentItemsSort(
      name,
      source.index,
      destination.index,
    )
  };

  render() {
    const { name, click, refresh } = this.props;
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
      >
        <Droppable droppableId="droppable">
          {
            provideds => (
              <div
                {...provideds.droppableProps}
                ref={provideds.innerRef}
              >
                <DetailsListItem
                  name={name}
                  click={click}
                  refresh={refresh}
                />
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
  name: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default DragList
