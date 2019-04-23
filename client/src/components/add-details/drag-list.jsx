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

  // 进入添加图片页面
  handleEdit = (val, index) => {
    const { history, name } = this.props;
    window.sessionStorage.setItem('images', JSON.stringify({ name, val, index }));
    history.push({ pathname: `/addImages/${window.__get__url__id}` })
  }

  render() {
    const { name, refresh } = this.props;
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
                  handleEdit={this.handleEdit}
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
  refresh: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default DragList
